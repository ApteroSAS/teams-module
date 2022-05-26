export = defaultTemplate;
/**
 * https://react-svgr.com/docs/custom-templates/
 *
 * This template is used in both the Storybook Webpack Config and app Webpack Config.
 *
 * Set the default icon color to #000 so we can set icon fill/stroke via CSS or via props.
 *
 * Set Color via CSS for any icon:
 *
 * svg {
 *   *[stroke=\#000] {
 *     stroke: white;
 *   }
 *
 *   *[fill=\#000] {
 *     fill: white;
 *   }
 * }
 *
 *
 * Set Color Via React Props:
 *
 * <IconComponent color="red" />
 *
 */
declare function defaultTemplate({ template }: {
    template: any;
}, opts: any, { imports, interfaces, componentName, props, jsx, exports }: {
    imports: any;
    interfaces: any;
    componentName: any;
    props: any;
    jsx: any;
    exports: any;
}): any;
