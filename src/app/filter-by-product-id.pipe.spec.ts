import { FilterByProductIdPipe } from './filter-by-product-id.pipe';

describe('FilterByProductIdPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterByProductIdPipe();
    expect(pipe).toBeTruthy();
  });
});
