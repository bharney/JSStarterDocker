import * as React from 'react';
import { Alert } from '../models';
import { AppThunkAction } from '../store';
import { CloseAlertAction } from '../store/Alert';


export interface AlertProps {
    items: Alert[];
    closeAlert(id: number): AppThunkAction<CloseAlertAction>;
}

export default class App extends React.Component<AlertProps, {}> {
    public render() {
        return (
                <div id="toast-container"  className="alerts toast-top-right" role="alert">
                {this.props.items.map(this.renderAlert)}
            </div>
        );
    }

    private renderAlert = (item: Alert) => {
        const styles = {
            display: "block"
        }
        const closeAction = (e: any) => { e.preventDefault(); this.props.closeAlert(item.id); };
        return (
            <div key={item.id} className={'toast toast-' + item.alertType + ' alert alert-dismissable ' + `fade fade-${item.state}`} style={styles} role="alert">
                    <a href="#" className="close" aria-label="close" onClick={closeAction}>&times;</a>
                    <div className="toast-message">
                        {item.message}
                    </div>
                </div>
        );
    }
}