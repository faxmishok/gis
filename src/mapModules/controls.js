import { Control } from 'ol/control';

export const selectYourMap = new Control({
  element: document.getElementById('layer-select'),
  target: document.getElementById('layer-div'),
});

export const selectYourDrawType = new Control({
  element: document.getElementById('draw-type'),
  target: document.getElementById('draw-geometry'),
});

export const selectYourProjection = new Control({
  element: document.getElementById('proj-select'),
  target: document.getElementById('proj-div'),
});
