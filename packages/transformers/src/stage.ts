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
import { assertNoClassificationLeak, assertRunicGlyphs } from './quality/validators.js';

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

    // Structural validation above proves the shape; this proves the content is
    // not nonsense. A dataset that parses cleanly can still be entirely wrong,
    // and the standing rule is to fail loudly on selector drift rather than
    // publish something plausible-looking.
    //
    // Per-record invariants only. Completeness of the rune row is a property of
    // the whole dataset, not of one transform call, so it is asserted by the
    // validate command instead — transforming a subset stays possible.
    assertRunicGlyphs(mappedRunes);

    const mappedDeities = DeitySchema.array().parse(deities(validatedInput));
    for (const deity of mappedDeities) {
        assertNoClassificationLeak('domains', deity.domains, deity.id);
    }
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
