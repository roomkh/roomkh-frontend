declare module '*.jsx' {
  const component: (props: Record<string, unknown>) => JSX.Element;
  export default component;
}
