
import { ActionTypeKeys, ActionType } from '../actions/actions';

export interface UIState {
    blownUpThumbnailId: string;
    selections: {
        images: Set<string>;
    };
}

const initialState: UIState = {
    blownUpThumbnailId: '',
    selections: {
        images: new Set<string>(),
    }
};

export function uiReducer(
    prevState: UIState = initialState,
    action: ActionType): UIState {
    switch (action.type) {
        case ActionTypeKeys.THUMBNAIL_BLOWN_UP:
            return Object.assign(
                {},
                prevState,
                {
                    blownUpThumbnailId: action.thumbnailId
                });
        case ActionTypeKeys.THUMBNAIL_BLOWN_DOWN:
            return Object.assign(
                {},
                prevState,
                {
                    blownUpThumbnailId: ''
                });
        case ActionTypeKeys.IMAGE_SELECTED:
            let imageIdsSet: Set<string> = addRemoveFromSet(
                prevState.selections.images,
                action.id
            );
            let newState = Object.assign({}, prevState);
            newState.selections = Object.assign({}, prevState.selections);
            newState.selections.images = imageIdsSet;
            return newState;
        // case ActionTypeKeys.IMAGES_SELECTED:
        //     imageIdsSet = addRemoveSetFromSet(
        //         prevState.selections.images,
        //         new Set(action.ids)
        //     );
        //     newState = Object.assign({}, prevState);
        //     newState.selections = Object.assign({}, prevState.selections);
        //     newState.selections.images = imageIdsSet;
        //     return newState;
        default:
            return prevState;
    }
}

function addRemoveFromSet(selectedBefore: Set<string>, selected: string): Set<string> {
    let set: Set<string> = new Set(selectedBefore);
    console.log(set);
    if (selectedBefore.has(selected)) {
        set.delete(selected);
        console.log("deleted", selected);
    } else {
        set.add(selected);
        console.log("added", selected);
    }
    console.log(set);
    return set;
}

// function addRemoveSetFromSet(selectedBefore: Set<string>, selected: Set<string>): Set<string> {
//     return setDifference(
//         setUnion(selectedBefore, selected),
//         setIntersection(selectedBefore, selected)
//     );
// }

// function setUnion<T>(...sets: Set<T>[]): Set<T> {
//     let union = new Set<T>();
//     sets.forEach(set => set.forEach(element => union.add(element)));
//     return union;
// }

// function setIntersection<T>(...sets: Set<T>[]): Set<T> {
//     return sets.reduce(
//         (A, B) => {
//             let X = new Set();
//             B.forEach((v => {
//                 if (A.has(v)) {
//                     X.add(v);
//                 }
//             }));
//             return X;
//         });
// }

// function setDifference<T>(...sets: Set<T>[]): Set<T> {
//     return sets.reduce(
//         ((A, B) => {
//             let X = new Set(A);
//             B.forEach(v => {
//                 if (X.has(v)) {
//                     X.delete(v);
//                 }
//             });
//             return X;
//         })
//     );
// }
