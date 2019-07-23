import * as React from 'react';
import { Modal, Row, Button, Icon } from 'antd';
import './resubmit.scss';

// the modal of trial resubmit
interface ResubmitProps {
    isResubmitConfirm: boolean;
    isShowOk: boolean;
    reSubmitJob: () => void;
    cancelResubmit: () => void;
    changeSucceedState: (bool: boolean) => void;
}

class Resubmit extends React.Component<ResubmitProps, {}> {

    constructor(props: ResubmitProps) {
        super(props);
    }

    closeSucceedHint = () => {
        this.props.changeSucceedState(false);
    }

    render() {
        const { isResubmitConfirm, reSubmitJob, cancelResubmit, isShowOk } = this.props;
        return (
            <Row>
                <Modal
                    visible={isResubmitConfirm}
                    footer={null}
                    destroyOnClose={true}
                    maskClosable={false}
                    closable={false}
                    width="40%"
                    centered={true}
                >
                    <Row className="resubmit">
                        <h2 className="title"><Icon type="info-circle" />Resubmit trial</h2>
                        <div className="hint">
                            Are you sure you want to resubmit the trial?
                            If confirmed, We will apply for a new trial ID for you.
                        </div>
                        <Row className="buttons">
                            {/* confirm to resubmit job */}
                            <Button
                                type="primary"
                                className="tableButton padding-all"
                                onClick={reSubmitJob}
                            >
                                Confirm
                            </Button>
                            {/* cancel this choose */}
                            <Button
                                type="primary"
                                className="tableButton grey-bgcolor padding-all margin-cancel"
                                onClick={cancelResubmit}
                            >
                                Cancel
                            </Button>
                        </Row>
                    </Row>
                </Modal>

                <Modal
                    visible={isShowOk}
                    footer={null}
                    destroyOnClose={true}
                    maskClosable={false}
                    closable={false}
                    width="40%"
                    centered={true}
                >
                    <Row className="resubmit">
                        <h2 className="title"><Icon type="check-circle" />Resubmit successfully</h2>
                        <div className="hint">
                            We have created a new trial, you can view the information of this trial
                            by ID XXXX No.XXX.
                        </div>
                        <Row className="buttons">
                            {/* close the modal */}
                            <Button
                                type="primary"
                                className="tableButton padding-all"
                                onClick={this.closeSucceedHint}
                            >
                                OK
                            </Button>
                        </Row>
                    </Row>
                </Modal>

            </Row>
        );
    }
}

export default Resubmit;
