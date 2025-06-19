<template>
  <n-space vertical :size="12">
    <n-data-table
      :bordered="false"
      :single-line="false"
      :columns="columns"
      :data="data"
      :pagination="pagination"
    />
  </n-space>
</template>

<script>
import { NButton, NTag, useMessage } from "naive-ui";
import { defineComponent, h } from "vue";

function createColumns({
  sendMail
}) {
  return [
    {
      title: "Ipress",
      key: "ipress"
    },
    {
      title: "Red",
      key: "datosRed.red"
    },
    {
      title: "Modalidad",
      key: "datosModalidad.modalidad"
    },
    {
      title: "Departamento",
      key: "datosUbigeo.departamento"
    },
    {
      title: "Distrito",
      key: "datosUbigeo.distrito"
    },
    {
      title: "Estado",
      key: "estado"
    },
    /* {
      title: "Age",
      key: "age"
    },
    {
      title: "Address",
      key: "address"
    },
    {
      title: "Action",
      key: "actions",
      render(row) {
        return h(
          NButton,
          {
            size: "small",
            onClick: () => sendMail(row)
          },
          { default: () => "Send Email" }
        );
      }
    } */
  ];
}

export default defineComponent({
  props: {
    dataSource: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const message = useMessage();
    return {
      data: props.dataSource,
      columns: createColumns({
        sendMail(rowData) {
          message.info(`send mail to ${rowData.name}`);
        }
      }),
      pagination: {
        pageSize: 10
      }
    };
  }
});
</script>

