//doc du médium editor : https://github.com/yabwe/medium-editor

const MediumEditorOptionsComment = {
    disableExtraSpace: true,
    disableDoubleReturn:true,
    placeholder: {
        /* This example includes the default options for placeholder,
           if nothing is passed this is what it used */
        text: "Votre commentaire ..."
    },
    imageDragging : false,
    autoLink: true,
    toolbar: {
        /* These are the default options for the toolbar,
           if nothing is passed this is what is used */
        allowMultiParagraphSelection: true,
        buttons: ['bold', 'italic', 'underline', 'anchor','unorderedlist'],
        diffLeft: 0,
        diffTop: -10,
        firstButtonClass: 'medium-editor-button-first',
        lastButtonClass: 'medium-editor-button-last',
        standardizeSelectionStart: false,
        /* options which only apply when static is true */
        align: 'center',
        sticky: false,
        updateOnEmptySelection: false

    }
};

export default MediumEditorOptionsComment