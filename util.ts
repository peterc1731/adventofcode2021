const helper = {
  top: 0,
  parent: (i: number) => ((i + 1) >>> 1) - 1,
  left: (i: number) => (i << 1) + 1,
  right: (i: number) => (i + 1) << 1,
};

export class PriorityQueue<T> {
  private heap: T[] = [];
  private comparator: (a: T, b: T) => boolean;
  constructor(comparator: (a: T, b: T) => boolean = (a, b) => a > b) {
    this.comparator = comparator;
  }
  public size() {
    return this.heap.length;
  }
  public isEmpty() {
    return this.size() == 0;
  }
  public peek() {
    return this.heap[helper.top];
  }
  public push(...values: T[]) {
    values.forEach((value) => {
      this.heap.push(value);
      this.siftUp();
    });
    return this.size();
  }
  public pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > helper.top) {
      this.swap(helper.top, bottom);
    }
    this.heap.pop();
    this.siftDown();
    return poppedValue;
  }
  public replace(value: T) {
    const replacedValue = this.peek();
    this.heap[helper.top] = value;
    this.siftDown();
    return replacedValue;
  }
  public contains(check: (n: T) => boolean) {
    return this.heap.some((n) => check(n));
  }
  public log() {
    console.log(this.heap);
  }
  private greater(i: number, j: number) {
    return this.comparator(this.heap[i], this.heap[j]);
  }
  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
  private siftUp() {
    let node = this.size() - 1;
    while (node > helper.top && this.greater(node, helper.parent(node))) {
      this.swap(node, helper.parent(node));
      node = helper.parent(node);
    }
  }
  private siftDown() {
    let node = helper.top;
    while (
      (helper.left(node) < this.size() &&
        this.greater(helper.left(node), node)) ||
      (helper.right(node) < this.size() &&
        this.greater(helper.right(node), node))
    ) {
      let maxChild =
        helper.right(node) < this.size() &&
        this.greater(helper.right(node), helper.left(node))
          ? helper.right(node)
          : helper.left(node);
      this.swap(node, maxChild);
      node = maxChild;
    }
  }
}
