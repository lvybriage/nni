import * as React from 'react';
import axios from 'axios';
import { WEBUIDOC, MANAGER_IP } from '../static/const';
import {
    Stack, initializeIcons, StackItem, CommandBarButton,
    IContextualMenuProps, IStackTokens, IStackStyles
} from 'office-ui-fabric-react';
import LogDrawer from './Modal/LogDrawer';
import ExperimentDrawer from './Modal/ExperimentDrawer';
import { downLoadIcon, infoIconAbout, timeIcon } from './Buttons/Icon';
import { OVERVIEWTABS, DETAILTABS, NNILOGO } from './stateless-component/NNItabs';
import '../static/style/nav/nav.scss';
import '../static/style/icon.scss';

initializeIcons();
const stackTokens: IStackTokens = {
    childrenGap: 15
};
const stackStyle: IStackStyles = {
    root: {
        minWidth: 400, height: 56, display: 'flex', verticalAlign: 'center'
    }
};

interface NavState {
    version: string;
    menuVisible: boolean;
    navBarVisible: boolean;
    isdisabledFresh: boolean;
    isvisibleLogDrawer: boolean;
    isvisibleExperimentDrawer: boolean;
    refreshText: string;
}

interface NavProps {
    changeInterval: (value: number) => void;
}

class NavCon extends React.Component<NavProps, NavState> {

    constructor(props: NavProps) {
        super(props);
        this.state = {
            version: '',
            menuVisible: false,
            navBarVisible: false,
            isdisabledFresh: false,
            isvisibleLogDrawer: false, // download button (nnimanager·dispatcher) click -> drawer
            isvisibleExperimentDrawer: false,
            refreshText: 'Auto Refresh'
        };
    }

    // to see & download experiment parameters
    showExpcontent = (): void => {
        this.setState({ isvisibleExperimentDrawer: true });
    }

    // to see & download dispatcher | nnimanager log
    showDispatcherLog = (): void => {
        this.setState({ isvisibleLogDrawer: true });
    }

    // refresh current page
    fresh = (event: React.SyntheticEvent<EventTarget>): void => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ isdisabledFresh: true }, () => {
            setTimeout(() => { this.setState({ isdisabledFresh: false }); }, 1000);
        });
    }

    // close log drawer (nnimanager.dispatcher)
    closeLogDrawer = (): void => {
        this.setState({ isvisibleLogDrawer: false });
    }

    // close download experiment parameters drawer
    closeExpDrawer = (): void => {
        this.setState({ isvisibleExperimentDrawer: false });
    }

    getNNIversion = (): void => {
        axios(`${MANAGER_IP}/version`, {
            method: 'GET'
        })
            .then(res => {
                if (res.status === 200) {
                    this.setState({ version: res.data });
                }
            });
    }

    openGithub = (): void => {
        const { version } = this.state;
        const feed = `https://github.com/Microsoft/nni/issues/new?labels=${version}`;
        window.open(feed);
    }

    openDocs = (): void => {
        window.open(WEBUIDOC);
    }

    getInterval = (num: number): void => {
        this.props.changeInterval(num);
        console.info(num); // eslint-disable-line
    }

    componentDidMount(): void {
        this.getNNIversion();
    }

    render(): React.ReactNode {
        const { isvisibleLogDrawer, isvisibleExperimentDrawer, version, refreshText } = this.state;
        const aboutProps: IContextualMenuProps = {
            items: [
                {
                    key: 'feedback',
                    text: 'Feedback',
                    iconProps: { iconName: 'OfficeChat' },
                    onClick: this.openGithub
                },
                {
                    key: 'help',
                    text: 'Document',
                    iconProps: { iconName: 'TextDocument' },
                    onClick: this.openDocs
                },
                {
                    key: 'version',
                    text: `Version ${version}`,
                    iconProps: { iconName: 'VerifiedBrand' },
                }
            ]
        };
        return (
            <Stack horizontal className="nav">
                <StackItem grow={30} styles={{ root: { minWidth: 300, display: 'flex', verticalAlign: 'center' } }}>
                    <span className="desktop-logo">{NNILOGO}</span>
                    <span className="left-right-margin">{OVERVIEWTABS}</span>
                    <span>{DETAILTABS}</span>
                </StackItem>
                <StackItem grow={70} className="navOptions">
                    {/* TODO: min width 根据实际的最小宽度来定 */}
                    <Stack horizontal horizontalAlign="end" tokens={stackTokens} styles={stackStyle}>
                        {/* refresh button danyi*/}
                        <CommandBarButton
                            iconProps={{ iconName: 'sync' }}
                            text="Refresh"
                            onClick={this.fresh}
                        />
                        <div className="nav-refresh">
                            <CommandBarButton
                                iconProps={timeIcon}
                                text={refreshText}
                                menuProps={this.refreshProps}
                            />
                            <div className="nav-refresh-num">10</div>
                        </div>
                        <CommandBarButton
                            iconProps={downLoadIcon}
                            text="Download"
                            menuProps={this.menuProps}
                        />
                        <CommandBarButton
                            iconProps={infoIconAbout}
                            text="about"
                            menuProps={aboutProps}
                        />
                    </Stack>
                </StackItem>
                {/* the drawer for dispatcher & nnimanager log message */}
                {isvisibleLogDrawer && <LogDrawer closeDrawer={this.closeLogDrawer} />}
                <ExperimentDrawer isVisble={isvisibleExperimentDrawer} closeExpDrawer={this.closeExpDrawer} />
            </Stack>
        );
    }

    // view and download experiment [log & experiment result]
    private menuProps: IContextualMenuProps = {
        items: [
            {
                key: 'experiment',
                text: 'Experiment Summary',
                iconProps: { iconName: 'ShowResults' },
                onClick: this.showExpcontent
            },
            {
                key: 'logfiles',
                text: 'Logfiles',
                iconProps: { iconName: 'FilePDB' },
                onClick: this.showDispatcherLog
            }
        ],
        directionalHintFixed: true
    };

    private refreshProps: IContextualMenuProps = {
        items: [
            {
                key: 'disableRefresh',
                text: 'Disable auto refresh',
                iconProps: { iconName: 'Mail' },
                onClick: this.getInterval.bind(this, 0)
            },
            {
                key: 'refresh10',
                text: 'Refresh every 10s',
                iconProps: { iconName: 'Calendar' },
                onClick: this.getInterval.bind(this, 10)
            },
            {
                key: 'refresh20',
                text: 'Refresh every 20s',
                iconProps: { iconName: 'Calendar' },
                onClick: this.getInterval.bind(this, 20)
            },
            {
                key: 'refresh30',
                text: 'Refresh every 30s',
                iconProps: { iconName: 'Calendar' },
                onClick: this.getInterval.bind(this, 30)
            },

            {
                key: 'refresh60',
                text: 'Refresh every 1min',
                iconProps: { iconName: 'Calendar' },
                onClick: this.getInterval.bind(this, 60)
            },

        ]
    };
}

export default NavCon;
