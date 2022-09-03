import React from 'react'
import { StyledConfigPanel } from './TetrisPage.styled';
import Configurable from './Configurable';
import configurables from 'data/configurables.json';

const ConfigPanel: React.FC = () => {

    const createConfigurables = () => {
        return (<></>)
    }

    return (
        <StyledConfigPanel>
            <div className="config-header">
                <p className="config-header-title">What? Configurable Variables</p>
                <p className="config-header-title">Why? Because it makes testing easier</p>
                <p className="config-header-title">How? You'll figure it out</p>
            </div>

            <div className="config-scrollbar">
                <div className="configurables">{createConfigurables()}</div>
            </div>
            <div className="configurable-footer">
                <button className="restore-defaults">Restore Defaults</button>
                <button className="save-changes">Save Changes</button>
            </div>
        </StyledConfigPanel>
    );
}
export default ConfigPanel;