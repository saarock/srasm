import React from 'react';
import TreeExplorer from './index';
import { useReadGlobalState } from '../../hooks';
import { initialState, demoSliceA, demoSliceB } from '../../srsm/userState';

const TreeWrapper: React.FC = () => {
    // We subscribe to all slices here to visualize them in the tree
    const { globalState } = useReadGlobalState({
        blog: initialState,
        demoA: demoSliceA,
        demoB: demoSliceB
    });

    return <TreeExplorer data={globalState} />;
};

export default TreeWrapper;
