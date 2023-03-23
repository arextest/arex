import styled from '@emotion/styled';

export const CollectionMenuWrapper = styled.div`
  width: 100%;
  .ant-spin-nested-loading,
  .ant-spin {
    height: 100%;
    max-height: 100% !important;
  }

  .collection-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .collection-header-create {
      margin-right: 5px;
      span.action {
        font-weight: bold;
      }
    }
    .collection-header-search {
    }
    .collection-header-view {
      margin: 0 5px;
    }
  }

  .ant-tree {
    background-color: transparent;
  }

  .ant-tree-title {
    width: 100%;
    .collection-title-render {
      color: ${(props) => props.theme.colorTextSecondary};
      display: flex;
      .right {
        float: right;
      }
      .left {
        flex: 1;
        overflow: hidden;
        display: flex;
        align-items: center;
        .content {
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
        }
      }
      :hover {
        color: ${(props) => props.theme.colorText};
      }
    }
  }

  .ant-tree-node-selected {
    .collection-title-render {
      color: ${(props) => props.theme.colorText};
    }
  }

  .ant-tree-node-content-wrapper {
    width: 10%;
    overflow-y: visible; //解决拖拽图标被隐藏
    // overflow-x: clip;
    // overflow-x: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
`;
