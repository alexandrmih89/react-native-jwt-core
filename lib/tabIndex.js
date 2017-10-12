import React from 'react';


class TabIndexForm extends React.Component {

  fields = {};

  focusNextField(nextField) {
    this.fields[nextField] && this.fields[nextField].getRenderedComponent().focus();
  }

  setField(tag, field) {
    this.fields[tag] = field;
  }

  render() {

    const { children, props } = this.props;

    console.log(children);

    return null;

    return children.map((elem) => {
      if(!elem.props.tabIndex) {
        return elem;
      }
      return React.cloneElement(elem, {
        ref: this.setField.bind(this,elem.props.tabIndex),
        onSubmitEditing: this.focusNextField.bind(this, 'password')
      })
    });
  }
}

export default TabIndexForm;