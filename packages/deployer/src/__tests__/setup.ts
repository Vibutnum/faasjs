jest.mock(process.cwd() + '/node_modules/cos-nodejs-sdk-v5', () => {
  return class Client {
    headBucket(params, callback) {
      console.log('mock.cos.headBucket', params);
      callback();
    }
    sliceUploadFile(params, callback) {
      console.log('mock.cos.sliceUploadFile', params);
      callback();
    }
    deleteObject(params, callback) {
      console.log('mock.cos.deleteObject', params);
      callback();
    }
  };
});

jest.mock(process.cwd() + '/node_modules/@faasjs/request', () => {
  return async function (url, params) {
    console.log('mock.request', url, params);
    switch (url) {
      case 'https://apigateway.api.qcloud.com/v2/index.php?':
        switch (params.body.Action) {
          case 'DescribeServicesStatus':
            return {
              body: '{"serviceStatusSet":[{"serviceName":"testing","serviceId":"serviceId"}]}'
            };
          default:
            return {
              body: '{"apiIdStatusSet":[{"apiId":"apiId","path":"/"}]}'
            };
        }

      case 'https://scf.tencentcloudapi.com/?':
        switch (params.body.Action) {
          case 'ListNamespaces':
            return {
              body: { Response: { "Namespaces": [{ Name: "testing" }] } }
            }
          default:
            return {
              body: { Response: {} }
            };
        }
    }
  };
});
