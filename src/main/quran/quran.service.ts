import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import path from 'path';
import * as fs from 'fs';
@Injectable()
export class QuranService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number) {
    const surah=await this.prisma.surah.findMany({
      include: {
      },
    });
    const dua=await this.prisma.dua.findMany()
    return {surah,dua};
  }
  // post all-quran to database one time just
  async seedQuran() {
    const isExist=await this.prisma.surah.findMany()
    const isExistAyah=await this.prisma.ayah.findMany()
    if(isExist || isExistAyah){
      throw new BadRequestException('Already You Have  quran mazid in you databse,at first you need to clean then you can add again.')
    }
    const filePath = path.join(__dirname, '..', '..', '..', 'quran.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    for (const surah of data) {
      await this.prisma.surah.create({
        data: {
          number: surah.surah_number,
          name: surah.name,
          meaning: surah.meaning,
          ayahs: {
            create: surah.ayahs.map((ayah) => ({
              number: ayah.number,
              text: ayah.text,
              translation: ayah.translation,
            })),
          },
        },
      });
      // console.log(`Inserted Surah: ${surah.name}`);
    }

    return { message: 'Quran data inserted successfully!' };
  }

  async findOne(id: number) {
    return this.prisma.ayah.findUnique({
      where: { id },
    });
  }

  // find surah by id
  async findBySurahAndVerse(surahId: number, verseNumber: number) {
    return this.prisma.ayah.findFirst({
      where: {
        surahId,
        number: verseNumber,
      },
    });
  }

  // search surah
  async search(keyword: string) {
    return this.prisma.ayah.findMany({
      where: {
        OR: [
          { text: { contains: keyword, mode: 'insensitive' } },
          { translation: { contains: keyword, mode: 'insensitive' } },
        ],
      },
    });
  }

  // get surah by name
  async getSurahByName(name: string) {
    try {
      const res = await this.prisma.surah.findUnique({
        where: {
          name: name,
        },
        include: {
          ayahs: true,
          gameData:true
        },
      });
      return res;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async  uploadIcon(dto:any, file:any){
    const findIconWithSurh=await this.prisma.surahIcon.findFirst({
      where:{
        surahNumber:parseInt(dto.surahNumber)
      }
    })
    if(findIconWithSurh){
      throw new HttpException('Icon for this Surah already exists',HttpStatus.BAD_REQUEST)
    }
    const {surahNumber}=dto
    const imagerURL = `${process.env.SERVER_BASE_URL}/uploads/quran/${file.filename}`

    const res=await this.prisma.surahIcon.create({
      data:{
        surahNumber:parseInt(surahNumber),
        icon:imagerURL
      }
    })
    return res
  }

  // get all surah icon
  async getAllSurahIcons(){
    return this.prisma.surahIcon.findMany()
  }



 async deleteSeededQuran() {
  await this.prisma.$executeRawUnsafe(`
    TRUNCATE TABLE 
      "GameData",
      "Ayah",
      "Surah",
      "Dua"
    RESTART IDENTITY CASCADE;
  `);

  return {
    message: "All Quran data deleted and IDs reset to 1"
  };
}

}
