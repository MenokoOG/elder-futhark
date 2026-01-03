import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform
} from "@nestjs/common";
import type { ZodError, ZodTypeAny } from "zod";

/**
 * ZodValidationPipe
 * - Validates incoming request payloads using a provided Zod schema.
 * - Returns parsed (typed) data on success.
 * - Throws BadRequestException with flattened Zod errors on failure.
 *
 * Usage:
 *   @Body(new ZodValidationPipe(MySchema)) body: MyType
 */
@Injectable()
export class ZodValidationPipe<TSchema extends ZodTypeAny>
  implements PipeTransform
{
  constructor(
    private readonly schema: TSchema,
    private readonly options?: {
      /**
       * Optional label to help identify which validation failed.
       * Example: "CreateUserBody" or "MentorChatRequest".
       */
      label?: string;

      /**
       * If true, includes `metadata` in the error response.
       */
      includeMetadata?: boolean;

      /**
       * If true, returns the raw Zod error in the response (not recommended for prod).
       */
      includeRawError?: boolean;
    }
  ) {}

  transform(value: unknown, metadata?: ArgumentMetadata): ReturnType<TSchema["parse"]> {
    const parsed = this.schema.safeParse(value);

    if (!parsed.success) {
      throw new BadRequestException(this.buildError(parsed.error, metadata));
    }

    return parsed.data as ReturnType<TSchema["parse"]>;
  }

  private buildError(err: ZodError, metadata?: ArgumentMetadata) {
    const flattened = err.flatten();

    const payload: Record<string, unknown> = {
      message: "Validation failed",
      details: {
        formErrors: flattened.formErrors,
        fieldErrors: flattened.fieldErrors
      }
    };

    if (this.options?.label) {
      payload.label = this.options.label;
    }

    if (this.options?.includeMetadata && metadata) {
      payload.metadata = {
        type: metadata.type,
        metatype: metadata.metatype?.name ?? null,
        data: metadata.data ?? null
      };
    }

    if (this.options?.includeRawError) {
      payload.raw = err;
    }

    return payload;
  }
}
