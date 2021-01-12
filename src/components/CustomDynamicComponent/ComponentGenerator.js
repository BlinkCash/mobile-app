import React from 'react';
import BankIcon from '../../../assets/svgs/bank'
import ECashVerveIcon from '../../../assets/svgs/eCashVerve'
import WUIcon from '../../../assets/svgs/wu'

import ElectricitySvg from '../../../assets/svgs/electricity';
import TransportTollSvg from '../../../assets/svgs/transportToll';
import SportBetSvg from '../../../assets/svgs/sportBet';
import CableTvSvg from '../../../assets/svgs/cableTv';
import AirlinesSvg from '../../../assets/svgs/airlines';
import LoanSvg from '../../../assets/svgs/loan';
import DataSvg from '../../../assets/svgs/data';
import InternetSvg from '../../../assets/svgs/internet';
import WesternUnionSvg from '../../../assets/svgs/westernUnion';

//nav icons
import HomeSvg from '../../../assets/svgs/home'
import TransferSvg from '../../../assets/svgs/transfer'
import BillsSvg from '../../../assets/svgs/bills'
import RechargeSvg from '../../../assets/svgs/recharge'


const components = {
    BankIcon: BankIcon,
    ECashVerveIcon: ECashVerveIcon,
    WUIcon: WUIcon,
    HomeSvg: HomeSvg,
    TransferSvg: TransferSvg,
    BillsSvg: BillsSvg,
    RechargeSvg: RechargeSvg,
    ElectricitySvg: ElectricitySvg,
    SportBetSvg: SportBetSvg,
    TransportTollSvg: TransportTollSvg,
    CableTvSvg: CableTvSvg,
    AirlinesSvg: AirlinesSvg,
    LoanSvg: LoanSvg,
    DataSvg: DataSvg,
    InternetSvg: InternetSvg,
    WesternUnionSvg: WesternUnionSvg
};

export const ComponentGenerator = (props) => {
    const TagName = components[props.tag];

    if (TagName) {
        return <TagName {...props}/>
    } else {
        return null
    }
};
