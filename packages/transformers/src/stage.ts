import {
    DeitySchema,
    RuneSchema,
    SourceRecordSchema,
    WorldSchema,
    type Deity,
    type Rune,
    type SourceRecord,
    type World
} from '@efa/schemas';
import { deities } from './canon/deities.transformer.js';
import { practices, type PracticeBuckets } from './canon/practices.transformer.js';
import { runes } from './canon/runes.transformer.js';
import { worlds } from './canon/worlds.transformer.js';

export interface TransformStageOutput {
    runes: Rune[];
    deities: Deity[];
    worlds: World[];
    practices: SourceRecord[];
    adjacentSystems: SourceRecord[];
}

export function transformExtractedRecords(records: SourceRecord[]): TransformStageOutput {
    const validatedInput = SourceRecordSchema.array().parse(records);
    const mappedRunes = RuneSchema.array().parse(runes(validatedInput));
    const mappedDeities = DeitySchema.array().parse(deities(validatedInput));
    const mappedWorlds = WorldSchema.array().parse(worlds(validatedInput));
    const practiceBuckets: PracticeBuckets = practices(validatedInput);

    return {
        runes: mappedRunes,
        deities: mappedDeities,
        worlds: mappedWorlds,
        practices: SourceRecordSchema.array().parse(practiceBuckets.practices),
        adjacentSystems: SourceRecordSchema.array().parse(practiceBuckets.adjacentSystems)
    };
}
