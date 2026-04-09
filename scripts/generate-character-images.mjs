#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { GoogleGenAI } from '@google/genai';

const cwd = process.cwd();
const promptFile = path.join(cwd, 'docs', 'character-image-prompts', 'character-prompts.md');
const defaultOutputDir = path.join(cwd, 'generated', 'personality-images');
const defaultManifestPath = path.join(defaultOutputDir, 'manifest.json');
const defaultModel = 'gemini-2.5-flash-image';

const parseArgs = (argv) => {
  const args = {
    code: null,
    codes: [],
    variant: 'main',
    model: defaultModel,
    out: defaultOutputDir,
    manifest: defaultManifestPath,
    dryRun: false,
    manifestOnly: false,
    overwrite: false,
    delayMs: 1200,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    switch (token) {
      case '--code':
        args.code = next;
        i += 1;
        break;
      case '--codes':
        args.codes = next.split(',').map((item) => item.trim()).filter(Boolean);
        i += 1;
        break;
      case '--variant':
        args.variant = next;
        i += 1;
        break;
      case '--model':
        args.model = next;
        i += 1;
        break;
      case '--out':
        args.out = path.resolve(cwd, next);
        args.manifest = path.resolve(cwd, next, 'manifest.json');
        i += 1;
        break;
      case '--manifest':
        args.manifest = path.resolve(cwd, next);
        i += 1;
        break;
      case '--delay-ms':
        args.delayMs = Number(next);
        i += 1;
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--manifest-only':
        args.manifestOnly = true;
        break;
      case '--overwrite':
        args.overwrite = true;
        break;
      case '--help':
        printHelp();
        process.exit(0);
        break;
      default:
        if (token.startsWith('--')) {
          throw new Error(`Unknown argument: ${token}`);
        }
    }
  }

  return args;
};

const printHelp = () => {
  console.log(`Usage:\n  pnpm gen:images\n  pnpm gen:images -- --code FAKE\n  pnpm gen:images -- --codes FAKE,DEAD,ZZZZ --variant all\n\nOptions:\n  --code <CODE>          Generate one code\n  --codes <A,B,C>        Generate multiple codes\n  --variant <name>       main | all | A | B | C ...\n  --model <MODEL>        Default: ${defaultModel}\n  --out <DIR>            Output directory, default: generated/personality-images\n  --manifest <FILE>      Manifest file path\n  --delay-ms <N>         Delay between requests, default: 1200\n  --dry-run              Parse only, do not call API\n  --manifest-only        Write manifest only, do not call API\n  --overwrite            Overwrite existing files\n  --help                 Show this help\n`);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeCode = (code) => code.trim().toLowerCase().replace(/!/g, '').replace(/[^a-z0-9-]/g, '');

const slugifyVariant = (variant) => {
  if (!variant || variant === 'main') {
    return '';
  }
  return `.${variant.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
};

const parsePromptDocument = (content) => {
  const stylePrefixMatch = content.match(/统一主风格前缀【一定要加！】：\s*```([\s\S]*?)```/);
  const stylePrefix = stylePrefixMatch?.[1].trim() ?? '';
  const headerMatches = [...content.matchAll(/^##\s+([^/\n]+?)\s*\/\s*(.+)$/gm)];

  return headerMatches.map((match, index) => {
    const code = match[1].trim();
    const nameZh = match[2].trim();
    const sectionStart = match.index ?? 0;
    const sectionEnd = index + 1 < headerMatches.length ? (headerMatches[index + 1].index ?? content.length) : content.length;
    const body = content.slice(sectionStart, sectionEnd);
    const mainPromptMatch = body.match(/(?:^|\n)(?:Prompt|主\s*Prompt[^\n]*?)\s*[:：]\s*\n\s*`([\s\S]*?)`/);
    const variants = [...body.matchAll(/变体\s*([A-Z])[^:：]*[:：]\s*\n\s*`([\s\S]*?)`/g)].map((variantMatch) => ({
      key: variantMatch[1],
      prompt: variantMatch[2].trim(),
    }));

    return {
      code,
      nameZh,
      stylePrefix,
      mainPrompt: mainPromptMatch?.[1].trim() ?? '',
      variants,
    };
  });
};

const composePrompt = (stylePrefix, prompt) => {
  if (!stylePrefix) {
    return prompt;
  }
  return `${stylePrefix}\n\n${prompt}`;
};

const selectPromptVariants = (entry, variantArg) => {
  if (variantArg === 'all') {
    return [
      { key: 'main', prompt: entry.mainPrompt },
      ...entry.variants,
    ].filter((item) => item.prompt);
  }

  if (variantArg === 'main') {
    return entry.mainPrompt ? [{ key: 'main', prompt: entry.mainPrompt }] : [];
  }

  const matched = entry.variants.find((item) => item.key.toLowerCase() === variantArg.toLowerCase());
  return matched ? [matched] : [];
};

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const fileExists = async (target) => {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
};

const writeManifest = async (manifestPath, manifest) => {
  await ensureDir(path.dirname(manifestPath));
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
};

const saveBase64Png = async (outputPath, base64Data) => {
  await ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, Buffer.from(base64Data, 'base64'));
};

const generateWithInteractions = async ({ ai, model, prompt }) => {
  const interaction = await ai.interactions.create({
    model,
    input: prompt,
    response_modalities: ['image'],
  });

  const outputs = interaction.outputs ?? [];
  const imageOutput = outputs.find((output) => output.type === 'image' && output.data);
  if (!imageOutput?.data) {
    throw new Error('The model did not return an image output');
  }

  return {
    mimeType: imageOutput.mime_type ?? 'image/png',
    data: imageOutput.data,
  };
};

const generateWithImagen = async ({ ai, model, prompt }) => {
  const response = await ai.models.generateImages({
    model,
    prompt,
    config: {
      numberOfImages: 1,
    },
  });

  const image = response.generatedImages?.[0]?.image;
  if (!image?.imageBytes) {
    throw new Error('The image model did not return image bytes');
  }

  return {
    mimeType: image.mimeType ?? 'image/png',
    data: image.imageBytes,
  };
};

const generateImage = async ({ ai, model, prompt }) => {
  if (model.startsWith('imagen-')) {
    return generateWithImagen({ ai, model, prompt });
  }
  return generateWithInteractions({ ai, model, prompt });
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const raw = await fs.readFile(promptFile, 'utf8');
  const entries = parsePromptDocument(raw);
  const requestedCodes = new Set([...(args.code ? [args.code] : []), ...args.codes].map((item) => item.toUpperCase()));
  const selectedEntries = requestedCodes.size > 0 ? entries.filter((entry) => requestedCodes.has(entry.code.toUpperCase())) : entries;

  const jobs = selectedEntries.flatMap((entry) => {
    const variants = selectPromptVariants(entry, args.variant);
    return variants.map((variant) => {
      const fileName = `${normalizeCode(entry.code)}${slugifyVariant(variant.key)}.png`;
      return {
        code: entry.code,
        nameZh: entry.nameZh,
        variant: variant.key,
        prompt: composePrompt(entry.stylePrefix, variant.prompt),
        outputPath: path.join(args.out, fileName),
        outputFileName: fileName,
      };
    });
  });

  if (jobs.length === 0) {
    throw new Error('No prompt jobs were selected. Check --code / --codes / --variant.');
  }

  const manifest = {
    model: args.model,
    generatedAt: new Date().toISOString(),
    source: path.relative(cwd, promptFile).replaceAll('\\', '/'),
    items: jobs.map((job) => ({
      code: job.code,
      nameZh: job.nameZh,
      variant: job.variant,
      outputPath: path.relative(cwd, job.outputPath).replaceAll('\\', '/'),
    })),
  };

  if (args.dryRun || args.manifestOnly) {
    console.log(JSON.stringify(manifest, null, 2));
    if (args.manifestOnly) {
      await writeManifest(args.manifest, manifest);
      console.log(`Manifest written to ${args.manifest}`);
    }
    return;
  }

  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GOOGLE_API_KEY (or GEMINI_API_KEY) environment variable');
  }

  const ai = new GoogleGenAI({ apiKey });
  await ensureDir(args.out);

  for (let index = 0; index < jobs.length; index += 1) {
    const job = jobs[index];
    const exists = await fileExists(job.outputPath);
    if (exists && !args.overwrite) {
      console.log(`[skip ${index + 1}/${jobs.length}] ${job.outputFileName} already exists`);
      continue;
    }

    console.log(`[gen ${index + 1}/${jobs.length}] ${job.code} (${job.variant}) -> ${job.outputFileName}`);
    const result = await generateImage({ ai, model: args.model, prompt: job.prompt });
    if (result.mimeType !== 'image/png' && !result.mimeType.startsWith('image/')) {
      throw new Error(`Unexpected image mime type: ${result.mimeType}`);
    }
    await saveBase64Png(job.outputPath, result.data);
    await sleep(args.delayMs);
  }

  await writeManifest(args.manifest, manifest);
  console.log(`Done. Manifest written to ${args.manifest}`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
