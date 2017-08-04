
type position = 'absolute' | 'fixed';
type overflow = 'auto' | 'initial';

let posFixed: position = 'fixed';
let overflowAuto: overflow = 'auto';

export const imageStyle = {
    seriesStyle: {
        //maxWidth: '20%',
        //maxHeight: '15%',
        //borderStyle: 'solid'
    },
     contentCenter:{
        wordWrap: 'break-word',
    },

    img: {
        maxWidth: '100%',
        maxHeight: '100%',
        //padding: '2px'
    },
    iconButtonStyle: {
        position: 'absolute',
        right: '-25px',
        top: '-25px'
    },

    blowUpDiv: {
        padding: 5,
        textAlign: 'center',
        display: 'inline-block',
        position: 'relative',
        margin: '15px'
    },
    wrapper: {
        textAlign: 'center',
        display: 'block'
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%'
    },
    backgroundDiv: {
        position: posFixed,
        top: 0,
        left: 0,
        background: "rgba(0, 0, 0, 0.6)",
        zIndex: 5,
        width: '75%',
        height: '100%',
        display: 'none',
        paddingTop: '70px',
        overflow: overflowAuto
    }
}