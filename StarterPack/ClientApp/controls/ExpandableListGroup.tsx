import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

type ExpandablePanelProps = {
    displayTitle: string,
    id: number
    }

export class ExpandableListGroup extends React.Component<ExpandablePanelProps, {}> {
    state = { active: false };
    handleClick = () => {
        this.setState({ active: !this.state.active });
    };
    public render() {
        return <div key={`sliderAccordion ${this.props.id}`} className="panel-group" id="sliderAccordion">
            <a data-toggle="collapse" className="list-group-item list-group-item" data-parent="#sliderAccordion" onClick={this.handleClick} role="tab" id={`heading${this.props.id}`} href={`#collapse${this.props.id}`} aria-expanded="false" aria-controls={`collapse${this.props.id}`}>
                            {this.props.displayTitle}
                <FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" style={{ verticalAlign: "-0.2em", marginLeft: "8px" }} icon={this.state.active ? faCaretDown : faCaretRight} />
                        </a>
                <div id={`collapse${this.props.id}`} className="panel-collapse collapse in" role="tabpanel" aria-labelledby={`heading${this.props.id}`}>
                    <ul className="list-group">
                        {this.props.children}
                    </ul>
                </div>
            </div>;
    }
}
export default ExpandableListGroup;