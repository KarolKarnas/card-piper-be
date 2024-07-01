import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteQuoteService } from './favorite-quote.service';

describe('FavoriteQuoteService', () => {
  let service: FavoriteQuoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteQuoteService],
    }).compile();

    service = module.get<FavoriteQuoteService>(FavoriteQuoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
