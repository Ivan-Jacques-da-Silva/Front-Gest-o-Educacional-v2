import React from 'react'
import SalesStatisticOne from './child/Carrousel';
import MenuHome from './child/MenuHome';
// import SalesStatisticOne from './child/SalesStatisticOne';
// import TotalSubscriberOne from './child/TotalSubscriberOne';
// import UsersOverviewOne from './child/UsersOverviewOne';
// import LatestRegisteredOne from './child/LatestRegisteredOne';
// import TopPerformerOne from './child/TopPerformerOne';
// import TopCountries from './child/TopCountries';
// import GeneratedContent from './child/GeneratedContent';

const ElementoHome = () => {

    return (
        <>
            <MenuHome />

            <section className="row gy-4 mt-1">
                <SalesStatisticOne />
            </section>

            {/*    <SalesStatisticOne />

                <TotalSubscriberOne />

                <UsersOverviewOne />

                <LatestRegisteredOne />

                <TopPerformerOne />

                <TopCountries />

                <GeneratedContent />

            </section> */}
        </>


    )
}

export default ElementoHome