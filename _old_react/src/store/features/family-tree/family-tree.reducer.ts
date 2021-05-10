import { createEntityAdapter, createReducer } from "@reduxjs/toolkit";
import { FamilyTreeActions } from "./family-tree.actions";
import { FamilyNode } from "./models/family-node.model";
import { FamilyStoreModel } from "./models/family-store.model";
import { mockNodes } from "./models/family-store.model.mock";

export const nodesAdapter = createEntityAdapter<FamilyNode>({
  selectId: (node) => node.id,
});

const initState: FamilyStoreModel = {
  nodes: nodesAdapter.addMany(nodesAdapter.getInitialState(), mockNodes),
  selectedNodeId: "ckl43z76h0000qdnaa5xycvs8",
  expandedIds: [],
};

export const familyTreeReducer = createReducer<FamilyStoreModel>(
  initState,
  (builder) => {
    builder
      .addCase(FamilyTreeActions.selectNode, (state, action) => ({
        ...state,
        selectedNodeId: action.payload.nodeId,
      }))
      .addCase(FamilyTreeActions.toggleBranch, (state, action) => {
        const { nodeId } = action.payload;
        const isExpanded = state.expandedIds.includes(nodeId);
        if (isExpanded) {
          return {
            ...state,
            expandedIds: state.expandedIds.filter((id) => id !== nodeId),
          };
        } else {
          // collapse other levels
          const node = state.nodes.entities[nodeId];
          const idsForRemove: string[] = [];

          //for DescendingFamilyTree
          if (node && node.parentIds.length > 0) {
            const parent = state.nodes.entities[node.parentIds[0]];
            if (parent) {
              idsForRemove.push(...parent.childrenIds);
            }
          }
          return {
            ...state,
            expandedIds: state.expandedIds
              .filter((id) => !idsForRemove.includes(id))
              .concat(nodeId),
          };
        }
      });
  }
);