import { Body, Controller, Post } from "@nestjs/common";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { z } from "zod";
import { transliterate } from "@efa/shared";

const TransliterateSchema = z.object({
  input: z.string().min(1).max(2000),
  mode: z.enum(["phonetic", "simple-substitution", "reverse", "atbash"])
});

@Controller("tools")
export class ToolsController {
  @Post("transliterate")
  transliterate(@Body(new ZodValidationPipe(TransliterateSchema)) body: any) {
    return transliterate(body.input, body.mode);
  }
}