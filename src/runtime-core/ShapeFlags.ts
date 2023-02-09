export const enum ShapeFlags {
  ELEMENT = 1, //1
  STATEFUL_COMPONENT = 1 << 1, // 01
  TEXT_CHILDREN = 1 << 2, // 001
  ARRAY_CHILDREN = 1 << 3, // 0001
}