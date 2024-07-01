import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteQuoteController } from './favorite-quote.controller';
import { FavoriteQuoteService } from './favorite-quote.service';

describe('FavoriteQuoteController', () => {
  let controller: FavoriteQuoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteQuoteController],
      providers: [FavoriteQuoteService],
    }).compile();

    controller = module.get<FavoriteQuoteController>(FavoriteQuoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
