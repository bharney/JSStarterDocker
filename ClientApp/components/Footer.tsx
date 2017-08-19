import * as React from 'react';

export class Footer extends React.Component<{}, {}> {
    public render() {
        return <footer className="container text-center">
                    <hr />
                    <div className="row">
                        <div className="col">
                            <p><strong>Made with <i className="fa fa-heart fa-lg"></i> by Brian Harney</strong></p>
                        </div>
                    </div>
                </footer>;
    }
}
