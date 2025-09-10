import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import path from 'path';
import * as fs from 'fs';
@Injectable()
export class QuranService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number) {
    return this.prisma.surah.findMany({
      include: {},
    });
  }
  // post all-quran to database one time just
  async seedQuran() {
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
        },
      });
      return res;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
