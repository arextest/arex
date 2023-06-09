import { Modal } from 'antd';
import { FC } from 'react';

import IconAccessibility from '~icons/carbon/accessibility';
import IconArchive from '~icons/lucide/archive';
import IconAccountBox from '~icons/mdi/account-box';
interface CollectionsImportExportProps {
  show: boolean;
  onHideModal: () => void;
}
const CollectionsImportExport: FC<CollectionsImportExportProps> = ({ show, onHideModal }) => {
  return (
    <Modal open={show} onCancel={onHideModal}>
      <IconAccessibility />
      <IconArchive />
    </Modal>
  );
};

export default CollectionsImportExport;
