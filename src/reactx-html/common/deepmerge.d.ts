declare module 'deepmerge' {
  const proc: (obj1: object, obj2: object, option?: { clone?: boolean }) => object
  export default proc
}