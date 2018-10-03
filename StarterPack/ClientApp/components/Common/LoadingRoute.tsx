import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

class LoadingRoute extends React.Component<{}, {}> {
  public render() {
    return (
      <div>
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      </div>
    );
  }
}

export default LoadingRoute;
