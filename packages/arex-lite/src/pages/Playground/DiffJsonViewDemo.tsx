import { DiffJsonView } from '@arextest/arex-core';
const Playground = () => {
  return (
    <div>
      <DiffJsonView
        diffJson={{
          left: JSON.stringify({
            orderid: 24541985105,
            refunditinerarylist: [
              {
                passengername: 'SERRATANAYA/RAQUEL',
                sequence: 1,
                rebookapplicationid: 0,
                canrefundall: 0,
                otheritineraryused: null,
                rebookid: null,
              },
              {
                passengername: 'RUIZDELGADO/ALEX',
                sequence: 1,
                rebookapplicationid: 0,
                canrefundall: 0,
                otheritineraryused: null,
                rebookid: null,
              },
            ],
            refundtypes: [1],
            source: 'RefundApply',
            operator: null,
            needpaycustomerresult: false,
            emdmoneytype: null,
            multiplecurrency: true,
            requesttype: 2,
            refundtargets: null,
            estimatedrefundtime: null,
            noqueryfeedetail: null,
          }),
          right: JSON.stringify({
            orderid: 24541985105,
            refunditinerarylist: [
              {
                passengername: 'SERRATANAYA/RAQUEL',
                sequence: 1,
                rebookapplicationid: 0,
                canrefundall: 0,
                otheritineraryused: null,
                rebookid: null,
              },
              {
                passengername: 'RUIZDELGADO/ALEX',
                sequence: 1,
                rebookapplicationid: 0,
                canrefundall: 0,
                otheritineraryused: null,
                rebookid: null,
              },
            ],
            refundtypes: [1],
            source: 'RefundApply',
            operator: null,
            needpaycustomerresult: false,
            emdmoneytype: null,
            multiplecurrency: true,
            requesttype: 2,
            refundtargets: null,
            estimatedrefundtime: null,
            noqueryfeedetail: null,
            specialqueryflag: 2,
          }),
        }}
        diffPath={[
          {
            baseValue: null,
            testValue: '2',
            logInfo: 'There is more node on the right : [specialqueryflag]',
            pathPair: {
              unmatchedType: 1,
              leftUnmatchedPath: [],
              rightUnmatchedPath: [
                {
                  nodeName: 'specialqueryflag',
                  index: 0,
                },
              ],
              listKeys: [],
              listKeyPath: [],
              trace: {
                currentTraceLeft: null,
                currentTraceRight: null,
              },
            },
            addRefPkNodePathLeft: null,
            addRefPkNodePathRight: null,
            warn: 0,
            path: null,
            logTag: {
              errorType: 6,
            },
          },
        ]}
        height={100}
      />
    </div>
  );
};

export default Playground;
