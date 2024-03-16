// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';

// Redux
import { connect } from 'react-redux';

// Helpers
import validate from './validate';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import {
    Grid,
    Button,
    Form,
    Row,
    FormGroup,
    Col,
    ControlLabel,
    FormControl,
    Checkbox
} from 'react-bootstrap';
import s from './ListRetreat.css';

// Component

import submit from './submit';

class Atmosphere extends Component {
    constructor(props) {
        super(props);

        this.state = {
            atmosphere: []
        };
    }

    renderFormControlCheckbox = ({ input: { value, onChange }, id, label, meta: { touched, error }, children, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <Col xs={12} md={3}>
                <Checkbox id={id} inline onChange={e => {
                    let newValue;
                    if (!value) newValue = [id];
                    else newValue = ([...value, id].filter((value, index, self) => {
                        return self.indexOf(value) === index;
                    }))
                    if (!e.target.checked) newValue = newValue.filter(each => each !== id)
                    onChange(newValue)
                }}>{label}</Checkbox>
            </Col>
        )
    }

    static getDerivedStateFromProps(props, state) {
        const { listingFields } = props;

        if (listingFields && listingFields.atmosphere && listingFields.atmosphere.length > 0) {
            let atmospheres = listingFields.atmosphere;
            let names = atmospheres.map(item=>item.itemName);
            names.sort();
            let results = [];
            for (let i = 0; i < names.length; i ++) {
                for (let j = 0; j < atmospheres.length; j ++) {
                    if (names[i] === atmospheres[j].itemName) {
                        results.push(atmospheres[j]);
                        break;
                    }
                }
            }
            return { atmosphere: results };
        } else {
            return null;
        }
    }

    render() {
        const { handleSubmit } = this.props;
        const { atmosphere } = this.state;

        return (
            <Grid fluid>
                <Row className={s.landingContainer}>
                    <Col xs={12}>
                        <div>
                            <h3 className={s.landingContentTitle}><FormattedMessage {...messages.atmosphere} /></h3>
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Grid>
                                        <Row className="show-grid">
                                            {
                                                atmosphere.map((each, index) => (
                                                    <Field id={each.id} key={index} name="atmospheres" component={this.renderFormControlCheckbox} label={each.itemName} />
                                                ))
                                            }
                                        </Row>
                                    </Grid>
                                </FormGroup>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

Atmosphere = reduxForm({
    form: 'RetreatForm', // a unique name for this form
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
    onSubmit: submit
})(Atmosphere);

const mapState = (state) => ({
    listingFields: state.listingFields.data
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Atmosphere)));
