<template>
    <div>
        <div>
            <my-upload field="img"
                @crop-success="cropSuccess"
                @srcFileSet="onPictureChange"
                v-model="show"
                :width="300"
                :height="300"
                langType='en'
                img-format="png"></my-upload>
            <img style="object-fit:contain;border-radius:10px" :src="imgDataUrl">
            <Button  v-if="this.pictureDisplay!=''" class="btn btn-primary" @click="toggleShow">Change picture</Button>
        </div>
    </div>
</template>


<script>
	import 'babel-polyfill';
	import myUpload from 'vue-image-crop-upload';

	export default{
		name: 'Picture',
        props: {
            pictureDisplay: String
        },
		data() {
            return {
                show: false,
                imgDataUrl: this.pictureDisplay
            }
		},
		components: {
			'my-upload': myUpload
		},
		methods: {
            onPictureChange(e) {
                if (e.target.files && e.target.files[0]) {
                    let pic = e.target.files[0];
                    this.newPictureName = pic.name;
                    this.newPictureObject = pic;
                }
            },
			toggleShow() {
				this.show = !this.show;
			},
			cropSuccess(imgDataUrl, field){
				console.log('-------- crop success --------');
				this.imgDataUrl = imgDataUrl;
			},
		}
	};
</script>