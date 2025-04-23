"use strict";
// Helper function to get RGB color string
function getRGBString(color) {
    return `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
}
// Type guard for nodes with fills
function hasFills(node) {
    return 'fills' in node && Array.isArray(node.fills);
}
// Type guard for nodes with corner radius
function hasCornerRadius(node) {
    return 'cornerRadius' in node && typeof node.cornerRadius === 'number';
}
// Type guard for nodes with padding
function hasPadding(node) {
    return 'paddingTop' in node &&
        'paddingRight' in node &&
        'paddingBottom' in node &&
        'paddingLeft' in node;
}
// Type guard for nodes with margin
function hasMargin(node) {
    return 'marginTop' in node &&
        'marginRight' in node &&
        'marginBottom' in node &&
        'marginLeft' in node;
}
// Type guard for text nodes
function isTextNode(node) {
    return node.type === 'TEXT';
}
// Helper function to get node styles
function getNodeStyles(node) {
    const styles = {};
    // Layout styles
    styles.layout = {
        position: 'absolute',
        sizing: {
            width: `${node.width}px`,
            height: `${node.height}px`
        },
        spacing: {}
    };
    // Get absolute bounding box
    const absoluteBoundingBox = {
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height
    };
    // Appearance styles
    styles.appearance = {};
    if (hasFills(node) && node.fills.length > 0) {
        const fill = node.fills[0];
        if (fill.type === 'SOLID') {
            styles.appearance.background = getRGBString(fill.color);
        }
    }
    // Border radius
    if (hasCornerRadius(node)) {
        const radius = `${node.cornerRadius}px`;
        styles.appearance.border = {
            style: 'solid',
            width: '0',
            color: 'transparent',
            radius: {
                topLeft: radius,
                topRight: radius,
                bottomRight: radius,
                bottomLeft: radius
            }
        };
    }
    // Padding
    if (hasPadding(node)) {
        styles.layout.spacing.padding = {
            top: `${node.paddingTop}px`,
            right: `${node.paddingRight}px`,
            bottom: `${node.paddingBottom}px`,
            left: `${node.paddingLeft}px`
        };
    }
    // Margin
    if (hasMargin(node)) {
        styles.layout.spacing.margin = {
            top: `${node.marginTop}px`,
            right: `${node.marginRight}px`,
            bottom: `${node.marginBottom}px`,
            left: `${node.marginLeft}px`
        };
    }
    // Typography styles
    if (isTextNode(node)) {
        styles.typography = {
            fontFamily: node.fontName !== figma.mixed ? node.fontName.family : 'Mixed',
            fontSize: node.fontSize !== figma.mixed ? `${node.fontSize}px` : 'Mixed',
            fontWeight: node.fontWeight !== figma.mixed ? node.fontWeight : 'Mixed',
            lineHeight: node.lineHeight !== figma.mixed && typeof node.lineHeight === 'object' && 'value' in node.lineHeight
                ? `${node.lineHeight.value}px`
                : 'Mixed',
            letterSpacing: node.letterSpacing !== figma.mixed && typeof node.letterSpacing === 'object' && 'value' in node.letterSpacing
                ? `${node.letterSpacing.value}px`
                : 'Mixed',
            textAlign: String(node.textAlignHorizontal) !== String(figma.mixed) ? String(node.textAlignHorizontal).toLowerCase() : 'Mixed',
            textDecoration: node.textDecoration !== figma.mixed ? node.textDecoration.toLowerCase() : 'none',
            textTransform: 'none'
        };
    }
    // Effects
    if ('effects' in node && node.effects && node.effects.length > 0) {
        styles.effects = {
            shadow: [],
            blur: undefined
        };
        node.effects.forEach(effect => {
            if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
                styles.effects.shadow.push({
                    color: getRGBString(effect.color),
                    offset: { x: effect.offset.x, y: effect.offset.y },
                    blur: effect.radius,
                    spread: 0
                });
            }
            else if (effect.type === 'LAYER_BLUR') {
                styles.effects.blur = {
                    type: 'layer',
                    radius: effect.radius
                };
            }
        });
    }
    // Auto layout properties
    if ('layoutMode' in node) {
        styles.autoLayout = {
            direction: node.layoutMode === 'HORIZONTAL' ? 'row' : 'column',
            alignment: node.primaryAxisAlignItems.toLowerCase(),
            padding: {
                top: node.paddingTop,
                right: node.paddingRight,
                bottom: node.paddingBottom,
                left: node.paddingLeft
            },
            spacing: node.itemSpacing
        };
    }
    // Constraints
    if ('constraints' in node) {
        styles.constraints = {
            horizontal: node.constraints.horizontal.toLowerCase(),
            vertical: node.constraints.vertical.toLowerCase()
        };
    }
    return styles;
}
// Function to get spacing between nodes
function getSpacingBetweenNodes(nodes) {
    if (nodes.length < 2)
        return { horizontal: 0, vertical: 0 };
    const sortedByX = [...nodes].sort((a, b) => a.x - b.x);
    const sortedByY = [...nodes].sort((a, b) => a.y - b.y);
    const horizontalSpacing = sortedByX[1].x - (sortedByX[0].x + sortedByX[0].width);
    const verticalSpacing = sortedByY[1].y - (sortedByY[0].y + sortedByY[0].height);
    return {
        horizontal: horizontalSpacing,
        vertical: verticalSpacing
    };
}
// Function to generate CSS
function generateCSS(node) {
    var _a, _b, _c, _d;
    let css = `/* ${node.name} */\n`;
    css += `{\n`;
    const styles = getNodeStyles(node);
    // Layout
    css += `  position: ${styles.layout.position};\n`;
    css += `  width: ${styles.layout.sizing.width};\n`;
    css += `  height: ${styles.layout.sizing.height};\n`;
    css += `  left: ${node.x}px;\n`;
    css += `  top: ${node.y}px;\n`;
    // Padding
    if (styles.layout.spacing.padding) {
        const { top, right, bottom, left } = styles.layout.spacing.padding;
        css += `  padding: ${top} ${right} ${bottom} ${left};\n`;
    }
    // Margin
    if (styles.layout.spacing.margin) {
        const { top, right, bottom, left } = styles.layout.spacing.margin;
        css += `  margin: ${top} ${right} ${bottom} ${left};\n`;
    }
    // Background
    if (styles.appearance.background) {
        css += `  background-color: ${styles.appearance.background};\n`;
    }
    // Border radius
    if ((_a = styles.appearance.border) === null || _a === void 0 ? void 0 : _a.radius) {
        const { topLeft, topRight, bottomRight, bottomLeft } = styles.appearance.border.radius;
        css += `  border-radius: ${topLeft} ${topRight} ${bottomRight} ${bottomLeft};\n`;
    }
    // Typography
    if (styles.typography) {
        const { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textAlign, textDecoration, textTransform } = styles.typography;
        css += `  font-family: ${fontFamily};\n`;
        css += `  font-size: ${fontSize};\n`;
        css += `  font-weight: ${fontWeight};\n`;
        css += `  line-height: ${lineHeight};\n`;
        css += `  letter-spacing: ${letterSpacing};\n`;
        css += `  text-align: ${textAlign};\n`;
        if (textDecoration !== 'none')
            css += `  text-decoration: ${textDecoration};\n`;
        if (textTransform !== 'none')
            css += `  text-transform: ${textTransform};\n`;
    }
    // Effects
    if ((_c = (_b = styles.effects) === null || _b === void 0 ? void 0 : _b.shadow) === null || _c === void 0 ? void 0 : _c.length) {
        const shadowValues = styles.effects.shadow.map((shadow) => `${shadow.offset.x}px ${shadow.offset.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`);
        css += `  box-shadow: ${shadowValues.join(', ')};\n`;
    }
    if ((_d = styles.effects) === null || _d === void 0 ? void 0 : _d.blur) {
        css += `  filter: blur(${styles.effects.blur.radius}px);\n`;
    }
    return css + '}\n';
}
// Function to generate Tailwind classes
function generateTailwind(node) {
    let classes = [];
    // Width and height
    classes.push(`w-[${Math.round(node.width)}px]`);
    classes.push(`h-[${Math.round(node.height)}px]`);
    // Position
    classes.push('absolute');
    classes.push(`left-[${Math.round(node.x)}px]`);
    classes.push(`top-[${Math.round(node.y)}px]`);
    // Background color
    if (hasFills(node) && node.fills.length > 0) {
        const fill = node.fills[0];
        if (fill.type === 'SOLID') {
            classes.push(`bg-[${getRGBString(fill.color)}]`);
        }
    }
    // Border radius
    if (hasCornerRadius(node)) {
        classes.push(`rounded-[${String(node.cornerRadius)}px]`);
    }
    return classes.join(' ');
}
// Main plugin code
figma.showUI(__html__, { width: 450, height: 600 });
figma.on('selectionchange', () => {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
        figma.ui.postMessage({ type: 'no-selection' });
        return;
    }
    const nodeInfos = selection.map(node => ({
        id: node.id,
        name: node.name,
        type: node.type,
        width: node.width,
        height: node.height,
        x: node.x,
        y: node.y,
        absoluteBoundingBox: {
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height
        },
        styles: getNodeStyles(node),
        exportSettings: ('exportSettings' in node) ?
            node.exportSettings.map(setting => ({
                format: setting.format,
                suffix: setting.suffix || '',
                constraint: {
                    type: 'SCALE',
                    value: 1
                }
            })) : undefined,
        constraints: ('constraints' in node) ? {
            horizontal: node.constraints.horizontal.toLowerCase(),
            vertical: node.constraints.vertical.toLowerCase()
        } : undefined,
        autoLayout: ('layoutMode' in node) ? {
            direction: node.layoutMode === 'HORIZONTAL' ? 'row' : 'column',
            alignment: node.primaryAxisAlignItems.toLowerCase(),
            padding: {
                top: node.paddingTop,
                right: node.paddingRight,
                bottom: node.paddingBottom,
                left: node.paddingLeft
            },
            spacing: node.itemSpacing
        } : undefined
    }));
    const spacing = selection.length >= 2 ? getSpacingBetweenNodes(selection) : null;
    const css = selection.map(node => generateCSS(node)).join('\n');
    const tailwind = selection.map(node => generateTailwind(node)).join('\n');
    figma.ui.postMessage({
        type: 'selection-update',
        nodes: nodeInfos,
        spacing,
        css,
        tailwind
    });
});
// Handle messages from the UI
figma.ui.onmessage = msg => {
    if (msg.type === 'close') {
        figma.closePlugin();
    }
};
