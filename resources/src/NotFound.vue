<template>
    <div class="not-found-wrapper">
        <div class="not-found-container">
            <div class="title">404</div>
            <div class="subtitle">Not found</div>
        </div>
    </div>
</template>

 <script></script>
<style scoped>
    .not-found-wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        background-color: rgb(var(--bs-light-rgb));
        font-family: Arial;
        color: #828da0;
        align-items: center;
    }

    .not-found-wrapper .not-found-container {
        flex-grow: 1;
        text-align: center;
    }

    .not-found-wrapper .title {
        font-size: 40px;
    }

    .not-found-wrapper .subtitle {
        font-size: 20px;
    }
</style>
