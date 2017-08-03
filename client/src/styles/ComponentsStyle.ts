
type position = 'absolute' | 'fixed';
let pos: position = 'fixed';

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
        position: 'relative'
    },
    wrapper: {
        textAlign: 'center',
        marginTop: '10px',
        display: 'block'
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%'
    },
    backgroundDiv: {
        position: pos,
        top: 0,
        left: 0,
        background: "rgba(0, 0, 0, 0.6)",
        zIndex: 5,
        width: '74%',
        height: '100%',
        display: 'none'
    }
}
