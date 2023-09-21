export type FormDataKeyValue = {
  key: string;
  active: boolean;
} & ({ isFile: true; value: Blob[] } | { isFile: false; value: string });

export type ArexRESTReqBodyFormData = {
  contentType: 'multipart/form-data';
  body: FormDataKeyValue[];
};
