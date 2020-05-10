## Cropper

[![npm version](https://badge.fury.io/js/%40muzikanto%2Fcropper.svg)](https://badge.fury.io/js/%40muzikanto%2Fcropper)
[![downloads](https://img.shields.io/npm/dm/@muzikanto/cropper.svg)](https://www.npmjs.com/package/@muzikanto/cropper)
[![dependencies Status](https://david-dm.org/muzikanto/cropper/status.svg)](https://david-dm.org/muzikanto/cropper)
[![size](https://img.shields.io/bundlephobia/minzip/@muzikanto/cropper)](https://bundlephobia.com/result?p=@muzikanto/cropper)

<!-- TOC -->

-  [Introduction](#introduction)
-  [Installation](#installation)
-  [Examples](#examples)
-  [Use](#use)
-  [License](#license)

<!-- /TOC -->

## Introduction

Peer dependencies: 
    `react`, `react-dom`,
    `material-ui/core`, `material-ui/styles`, `material-ui/icons`

## Installation

```sh
npm i @muzikanto/cropper
# or
yarn add @muzikanto/cropper
```

### Introduction

if you are interested in the package, please create an issue in github with your wishes, and then I will make changes

### new features

- add easy customizing styles
- add light theme
- add transition effects
- add filters tab
- add resize original tab
- add limited selection
- add easy use CropManager

## Examples

[Example in storybook](https://muzikanto.github.io/cropper)

### Use

```typescript jsx
function Component() {
    const [base64, setBase64] = React.useState('');
    
  return (
      <>
          <BaseCropper
              src="https://github.com/Muzikanto/cropper/blob/master/src/test.jpg"
              onChange={(v) => setBase64(v)}
    
              flippedX={true} // show flip x button
              flippedY={true} // show flip y button
              rotatedLeft={true} // show rotate left button
              rotatedRight={true} // show rotate right button
              rotateToAngle={true} // show bottom rotate line
              sizePreview={true} // show size preview
              aspectRatio={[
                  'free', 'square', 'landscape', 'portrait',
                  {icon: <CustomIcon/>, value: 13 / 10, label: 'custom'},
              ]} // list of aspects
              // aspectRatio={ 16 / 10 } one value => hide select aspectRatio
          />
          <img src={base64}/>
      </>
  );
}
```

## License

[MIT](LICENSE)
