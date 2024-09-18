import TestRenderer from 'react-test-renderer';
import React, { lazy } from 'react';
import withSuspense from './withSuspense';

const TestComponent = () => {
  return (
    <div>
      Компонент 1
    </div>
  );
};

const LazyTestComponent = lazy(() => TestComponent);

const MemoizedComponent = React.memo(() => {
  return (
    <div>
      <LazyTestComponent />
    </div>
  );
});

describe('withSuspence', () => {
  it('rendered lazy', async () => {
    const root = await TestRenderer.create(
      withSuspense(MemoizedComponent)
    );

    const tree = root.toJSON();

    /* await TestComponent; */
    expect(tree).toMatchSnapshot();
  });
});

