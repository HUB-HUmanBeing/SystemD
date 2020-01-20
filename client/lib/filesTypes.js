
const filesTypes = [
    {
        label: "video",
        mimes:["video/mp4", "video/avi", "video/flv", "video/m4v", "video/mkv", "video/x-matroska", "video/mov", "video/mpeg", "video/mpg", "video/mts", "video/vob", "video/webm", "video/wmv", "video/3gp", "video/3gpp", "video/x-msvideo", "video/x-flv", "video/quicktime", "video/mp2t", "video/x-ms-wmv"],
        iconUrl: "/images/icon/files/video1.svg"
    },
    {
        label: "audio",
        mimes:["audio/mp4", "audio/mp3", "audio/mpg"],
        iconUrl: "/images/icon/files/audio.svg"
    },
    {
        label: "image",
        mimes:["image/jpeg", "image/gif", "image/png", "image/svg+xml", "image/jpg"],
        iconUrl: "/images/icon/files/image.svg"
    },
    {
        label: "pdf",
        mimes:["application/pdf", "application/x-pdf"],
        iconUrl: "/images/icon/files/pdf.svg"
    },
    {
        label: "doc",
        mimes: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        iconUrl: "/images/icon/files/word.svg"
    },
    {
        label: "sheet",
        mimes:   ["application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.spreadsheet"],
        iconUrl: "/images/icon/files/excel.svg"
    },
    {
        label: "deleted",
        mimes:["deleted"],
        iconUrl: "/images/icon/files/deleted-file.png"
    }
]
export default filesTypes
