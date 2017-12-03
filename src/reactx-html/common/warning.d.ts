declare module 'warning' {
  const warning: (condition: boolean, msg: string, ...arg: string[]) => void
  export default warning
}
