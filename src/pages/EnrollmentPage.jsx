import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import EnrollmentTrendLine from '../components/EnrollmentTrendLine';
import MostAndLeastEnrollment from '../components/MostAndLeastEnrollment';
import EnrollmentPlanSplit from '../components/EnrollmentPlanSplit ';
import BeneficiariesTrendLine from '../components/BeneficiariesTrendLine';
import EnrollmentGrowthChart from '../components/EnrollmentGrowthChart';
import PlanComposition from '../components/PlanComposition';
import StateEnrollment from '../components/StateEnrollment';
const dashboard_api = import.meta.env.VITE_DASHBOARD_API_URL;
const cms_data_api = import.meta.env.VITE_CMS_DATA_API;

const EnrollmentPage = () => {
  const [currentMAEnrollments, setCurrentMAEnrollments] = useState(null);
  const [totalMedicareEnrollments, setTotalMedicareEnrollments] = useState(null);
  const [enrollmentTrendData, setEnrollmentTrendData] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [usStatePlanData, setUsStatePlanData] = useState({});
  const [enrollmentPlanSplitData, setEnrollmentPlanSplitData] = useState(null);
  const [csmData, setCmsData] = useState([]);
  const [enrollmentPlanCompositionData, setEnrollmentPlanCompositionData] = useState([]);
  const [planWithAllOrg, setPlanWithAllOrg] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          currentMAEnrollmentsResponse,
          totalMedicareEnrollmentsResponse,
          trendOverTimeResponse,
          geoDataResponse,
          currentMonthStatePlanResponse,
          planResponse,
          cmsDataResponse,
          planWithParentOrgFilterResponse,
          planWithAllOrgResponse,
        ] = await Promise.all([
          axios.get(`${dashboard_api}/api/v1/current_ma_enrollments`),
          axios.get(
            `${cms_data_api}/dataset/b069bf21-34ab-4b57-90ee-7442efbacf7f/data?column=TOT_BENES&additionalProp1=%7B%7D&group_by=YEAR`
          ),
          axios.get(`${dashboard_api}/api/v1/trend_over_time`),
          axios.get(`${dashboard_api}/api/v1/state_enrollment`),
          axios.get(`${dashboard_api}/api/v1/current_month_state_plan`),
          axios.get(`${dashboard_api}/api/v1/plan`),
          axios.get(`${cms_data_api}/dataset/b069bf21-34ab-4b57-90ee-7442efbacf7f/data?group_by=MONTH%2CYEAR&column=ORGNL_MDCR_BENES, MA_AND_OTH_BENES,PRSCRPTN_DRUG_TOT_BENES,A_B_TOT_BENES,DUAL_TOT_BENES,YEAR,MONTH&filter[BENE_GEO_LVL]=National`),
          axios.get(`${dashboard_api}/api/v1/plan_with_parent_org_filter`),
          axios.get(`${dashboard_api}/api/v1/current_year_all_org_plan_filter`),
        ]);

        setCurrentMAEnrollments(currentMAEnrollmentsResponse.data.latest_enrollment);
        setTotalMedicareEnrollments(
          totalMedicareEnrollmentsResponse.data.slice(-1)[0].TOT_BENES
        );
        setEnrollmentTrendData(trendOverTimeResponse.data.trend_over_time);
        setUsStatePlanData(currentMonthStatePlanResponse.data.current_month_state_plan);
        setEnrollmentPlanSplitData(planResponse.data.plan);
        setGeoData(geoDataResponse.data.state_enrollment);
        setCmsData(cmsDataResponse.data)
        setEnrollmentPlanCompositionData(planWithParentOrgFilterResponse.data.plan_with_parent_org_filter);
        setPlanWithAllOrg(planWithAllOrgResponse.data.current_year_all_org_plan_filter);
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col space-y-4 w-full h-full p-4'>
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center mt-4">
        <div className="bg-dark-blue p-4 rounded-lg shadow-md flex-1 text-white ">
          <h2 className="font-canela font-bold text-2xl mb-2">Current MA Enrollments</h2>
          <p className="font-karla text-3xl font-bold text-aqua">
            <CountUp end={currentMAEnrollments} duration={2.5} />
          </p>
        </div>
        <div className="bg-dark-blue p-4 rounded-lg shadow-md flex-1 ">
          <h2 className="font-canela font-bold text-2xl mb-2 text-white">Total Medicare Enrollments</h2>
          <p className="font-karla text-3xl font-bold text-aqua">
            <CountUp end={totalMedicareEnrollments} duration={2.5} />
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="flex flex-col items-center w-full">
          <h1 className="font-canela font-bold text-2xl text-dark-blue mb-4">Enrollment Trends</h1>
          <div className="w-full  max-w-full">
            <EnrollmentTrendLine trendData={enrollmentTrendData} geoData={geoData} />
          </div>
        </div>
        <div className="flex flex-col items-center w-full">
          <h1 className="font-canela font-bold text-2xl text-dark-blue mb-4">Most & Least Enrollment</h1>
          <div className="w-full  max-w-full">
            <MostAndLeastEnrollment data={usStatePlanData} />
          </div>
        </div>
      </div>

      {/* Plan Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="flex flex-col items-center w-full">
          <h1 className="font-canela font-bold text-2xl text-dark-blue mb-4">Enrollment by Plans</h1>
          <div className="w-full  max-w-full">
            <EnrollmentPlanSplit data={enrollmentPlanSplitData} />
          </div>
        </div>
        <div className="flex flex-col items-center w-full">
          <h1 className="font-canela font-bold text-2xl text-dark-blue mb-4">Beneficiaries Trend</h1>
          <div className="w-full  max-w-full">
            <BeneficiariesTrendLine trendData={csmData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="flex flex-col items-center w-full">
          <h1 className="font-canela font-bold text-2xl text-dark-blue mb-4">Enrollment Growth</h1>
          <div className="w-full  max-w-full">
            <EnrollmentGrowthChart data={enrollmentPlanCompositionData} />
          </div>
        </div>
        <div className="flex flex-col items-center w-full">
          <h1 className="font-canela font-bold text-2xl text-dark-blue mb-4">Beneficiaries Trend</h1>
          <div className="w-full  max-w-full">
            <PlanComposition data={planWithAllOrg} />
          </div>
        </div>
       
      </div>
      <div className="flex flex-col items-center w-full">
          <h1 className="font-canela font-bold text-2xl text-dark-blue mb-4">Enrollment Across States</h1>
          <div className="w-full h-[400px] max-w-full">
            <StateEnrollment enrollmentData={usStatePlanData} geoData={geoData} />
          </div>
        </div>
    </div>
  );
};

export default EnrollmentPage;
