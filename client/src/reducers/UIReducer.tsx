
import { ActionTypeKeys, ActionType } from '../actions/actions';

export interface UIState {
    isBlownUpShowed: boolean;
    blownUpThumbnailId: string;
    selections: {
        images: string[];
        series: string[]
    };
}

const initialState: UIState = {
    isBlownUpShowed: false,
    blownUpThumbnailId: '',
    selections: {
        images: [],
        series: []
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
                    isBlownUpShowed: true,
                    blownUpThumbnailId: action.thumbnailId
                });
        case ActionTypeKeys.THUMBNAIL_BLOWN_DOWN:
            return Object.assign(
                {},
                prevState,
                {
                    isBlownUpShowed: false,
                    blownUpThumbnailId: ''
                });
        case ActionTypeKeys.IMAGE_SELECTED:
            let imageIdsArray: string[] = addRemoveFromArray(
                prevState.selections.images,
                action.id
            );
            let newState = Object.assign({}, prevState);
            newState.selections = Object.assign({}, prevState.selections);
            newState.selections.images = imageIdsArray;
            return newState;
        case ActionTypeKeys.SERIES_SELECTED:
            let seriesIdsArray: string[] = addRemoveFromArray(
                prevState.selections.series,
                action.id
            );
            newState = Object.assign({}, prevState);
            newState.selections = Object.assign({}, prevState.selections);
            newState.selections.series = seriesIdsArray;
            return newState;
        case ActionTypeKeys.SERIES_ALL_UNSELECTED:
            newState = Object.assign({}, prevState);
            newState.selections = Object.assign({}, prevState.selections);
            newState.selections.series = [];
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

function addRemoveFromArray(selectedBefore: string[], selected: string): string[] {
    let array: string[];
    let index: number = selectedBefore.indexOf(selected);
    if ( index !== -1) {
        array = [...selectedBefore.slice(0, index), ...selectedBefore.slice(index + 1)];
    } else {
        array = [selected, ...selectedBefore];
    }
    return array;
}

// function addRemoveFromSet(selectedBefore: Set<string>, selected: string): Set<string> {
//     let set: Set<string> = new Set(selectedBefore);
//     if (selectedBefore.has(selected)) {
//         set.delete(selected);
//     } else {
//         set.add(selected);
//     }
//     return set;
// }

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
