import fs from 'fs';
import path from 'path';
import {promisify} from 'util';

type Icon = {
  absolutePath: string;
  componentName: string;
  name: string;
};

const iconsdir = path.join(__dirname, '..', 'icons');
const outdir = path.join(__dirname, '..', 'js', 'components', 'icons');
const banner = `/* AUTOGENERATED. DO NOT MODIFY. */
/* eslint-disable */`;

const icons: Array<Icon> = fs
  .readdirSync(iconsdir)
  .sort()
  .map((iconFilename) => {
    const name = path.basename(iconFilename, '.svg');
    const componentName = name
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\W/g, '');
    return {
      absolutePath: path.resolve(iconsdir, iconFilename),
      name,
      componentName,
    };
  });

// Generate the icon components
icons.forEach(async (icon) => {
  const svgSource = await promisify(fs.readFile)(icon.absolutePath, 'utf8');
  const out = path.join(outdir, `${icon.componentName}.tsx`);
  promisify(fs.writeFile)(
    out,
    `${banner}
import React from 'react';

export default function ${
      icon.componentName
    }(props: React.ComponentProps<'svg'>) {
  return ${svgSource.replace('>', ' {...props}>').replace(/\n$/, '')}
}
`,
  );
});

fs.writeFile(
  path.join(outdir, '..', 'Icon.tsx'),
  `${banner}
import React from 'react';
${icons
  .map(
    (icon) =>
      `import ${icon.componentName} from 'App/components/icons/${
        icon.componentName
      }';`,
  )
  .join('\n')}

const icons = {
${icons.map((icon) => `  '${icon.name}': ${icon.componentName},`).join('\n')}
};

type Props = {
  icon: keyof typeof icons;
  size?: number;
};

function Icon(props: Props) {
  const IconComponent = icons[props.icon];
  const size = props.size || 13;
  const style = {
    fill: 'currentcolor',
    height: size,
    width: size,
  };
  return (
    <IconComponent preserveAspectRatio="xMidYMid meet" style={style} />
  );
}

export default Icon;
  `,
  () => {},
);