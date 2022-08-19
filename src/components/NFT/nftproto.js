import { computed } from "vue";
import utilsFormat from "@utils/format";
export default function renderProperties(box_detail) {
  const properties = computed(() => {
    return [
      {
        title: utilsFormat.computedLangCtx("nftproperty.Background"),
        value: box_detail.properties?.background || "--",
        score: box_detail.properties?.backgroundScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Fur"),
        value: box_detail.properties?.fur || "--",
        score: box_detail.properties?.furScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Skin"),
        value: box_detail.properties?.skin || "--",
        score: box_detail.properties?.skinScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Clothes"),
        value: box_detail.properties?.clothes || "--",
        score: box_detail.properties?.clothesScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Facial Expression"),
        value: box_detail.properties?.facialExpression || "--",
        score: box_detail.properties?.facialExpressionScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Head"),
        value: box_detail.properties?.head || "--",
        score: box_detail.properties?.headScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Acc"),
        value: box_detail.properties?.accessories || "--",
        score: box_detail.properties?.accessoriesScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Eyes"),
        value: box_detail.properties?.eyes || "--",
        score: box_detail.properties?.eyesScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Hat"),
        value: box_detail.properties?.hat || "--",
        score: box_detail.properties?.hatScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Costume"),
        value: box_detail.properties?.costume || "--",
        score: box_detail.properties?.costumeScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Makeup"),
        value: box_detail.properties?.makeup || "--",
        score: box_detail.properties?.makeupScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Shoes"),
        value: box_detail.properties?.shoes || "--",
        score: box_detail.properties?.shoesScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Mouth"),
        value: box_detail.properties?.mouth || "--",
        score: box_detail.properties?.mouthScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Earring"),
        value: box_detail.properties?.earring || "--",
        score: box_detail.properties?.earringScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Necklace"),
        value: box_detail.properties?.necklace || "--",
        score: box_detail.properties?.necklaceScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Neck"),
        value: box_detail.properties?.neck || "--",
        score: box_detail.properties?.neckScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Hair"),
        value: box_detail.properties?.hair || "--",
        score: box_detail.properties?.hairScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Horn"),
        value: box_detail.properties?.horn || "--",
        score: box_detail.properties?.hornScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Hands"),
        value: box_detail.properties?.hands || "--",
        score: box_detail.properties?.handsScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Body"),
        value: box_detail.properties?.body || "--",
        score: box_detail.properties?.bodyScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Tattoo"),
        value: box_detail.properties?.tattoo || "--",
        score: box_detail.properties?.tattooScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.People"),
        value: box_detail.properties?.people || "--",
        score: box_detail.properties?.peopleScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Characteristic"),
        value: box_detail.properties?.characteristic || "--",
        score: box_detail.properties?.characteristicScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Hobby"),
        value: box_detail.properties?.hobby || "--",
        score: box_detail.properties?.hobbyScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Zodiac"),
        value: box_detail.properties?.zodiac || "--",
        score: box_detail.properties?.zodiacScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Action"),
        value: box_detail.properties?.action || "--",
        score: box_detail.properties?.actionScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Toys"),
        value: box_detail.properties?.toys || "--",
        score: box_detail.properties?.toysScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Fruits"),
        value: box_detail.properties?.fruits || "--",
        score: box_detail.properties?.fruitsScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Vegetables"),
        value: box_detail.properties?.vegetables || "--",
        score: box_detail.properties?.vegetablesScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Meat"),
        value: box_detail.properties?.meta || "--",
        score: box_detail.properties?.metaScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Beverages"),
        value: box_detail.properties?.beverages || "--",
        score: box_detail.properties?.beveragesScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Food"),
        value: box_detail.properties?.food || "--",
        score: box_detail.properties?.foodScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Vehicle"),
        value: box_detail.properties?.vehicle || "--",
        score: box_detail.properties?.vehicleScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Weather"),
        value: box_detail.properties?.weather || "--",
        score: box_detail.properties?.weatherScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Month"),
        value: box_detail.properties?.month || "--",
        score: box_detail.properties?.monthScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Sports"),
        value: box_detail.properties?.sports || "--",
        score: box_detail.properties?.sportsScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Music"),
        value: box_detail.properties?.music || "--",
        score: box_detail.properties?.musicScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Movies"),
        value: box_detail.properties?.movies || "--",
        score: box_detail.properties?.moviesScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Season"),
        value: box_detail.properties?.season || "--",
        score: box_detail.properties?.seasonScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Outfit"),
        value: box_detail.properties?.outfit || "--",
        score: box_detail.properties?.outfitScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Face"),
        value: box_detail.properties?.face || "--",
        score: box_detail.properties?.faceScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Arm"),
        value: box_detail.properties?.arm || "--",
        score: box_detail.properties?.armScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Leg"),
        value: box_detail.properties?.leg || "--",
        score: box_detail.properties?.legScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Foot"),
        value: box_detail.properties?.foot || "--",
        score: box_detail.properties?.footScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Weapon"),
        value: box_detail.properties?.weapon || "--",
        score: box_detail.properties?.weaponScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Helmet"),
        value: box_detail.properties?.helmet || "--",
        score: box_detail.properties?.helmetScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Armor"),
        value: box_detail.properties?.armor || "--",
        score: box_detail.properties?.armorScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Mecha"),
        value: box_detail.properties?.mecha || "--",
        score: box_detail.properties?.mechaScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Pants"),
        value: box_detail.properties?.pants || "--",
        score: box_detail.properties?.pantsScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Skirt"),
        value: box_detail.properties?.skirt || "--",
        score: box_detail.properties?.skirtScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Left Hand"),
        value: box_detail.properties?.leftHand || "--",
        score: box_detail.properties?.leftHandScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Right Hand"),
        value: box_detail.properties?.rightHand || "--",
        score: box_detail.properties?.rightHandScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Pets"),
        value: box_detail.properties?.pets || "--",
        score: box_detail.properties?.petsScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Gifts"),
        value: box_detail.properties?.gifts || "--",
        score: box_detail.properties?.giftsScore || "--",
      },
      {
        title: utilsFormat.computedLangCtx("nftproperty.Tail"),
        value: box_detail.properties?.tail || "--",
        score: box_detail.properties?.tailScore || "--",
      },
    ];
  });
  return {
    properties,
  };
}
