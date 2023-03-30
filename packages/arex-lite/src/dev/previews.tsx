import { ComponentPreview, Previews } from '@react-buddy/ide-toolbox';
import React from 'react';

import App from '../App';
import { PaletteTree } from './palette';

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path='/'>
        <App />
      </ComponentPreview>
      <ComponentPreview path='/ComponentPreviews'>
        <ComponentPreviews />
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;
