import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ReactionEntity } from '@prisma/client';

@Injectable()
export class ParseEntitiesPipe implements PipeTransform {
  transform(value: string): ReactionEntity[] {
    if (!value) {
      return [];
    }

    const entities = value.split(',').map((item) => item.trim().toUpperCase());

    // Validate the entities against the ReactionEntity enum
    for (const entity of entities) {
      if (!(entity in ReactionEntity)) {
        throw new BadRequestException(`Invalid entity: ${entity}`);
      }
    }

    return entities as ReactionEntity[];
  }
}
