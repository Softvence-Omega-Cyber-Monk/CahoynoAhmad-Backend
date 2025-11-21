// src/game/game.service.ts
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestStatus, QuestType } from 'generated/prisma';
import * as fs from 'fs';
import * as path from 'path';
import { DuaDto } from './dto/createDua.dto';


@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto) {

    // const isExistSurah=await this.prisma.surah.findFirst({
    //   where:{
    //     id:createGameDto.surahId
    //   }
    // })
    //   const isExistAyah=await this.prisma.surah.findFirst({
    //   where:{
    //     id:createGameDto.ayahId
    //   }
    // })
    // if(!isExistSurah){
    //   throw new ForbiddenException("Surah not found please check  you surah id or seed the quran in your data base and try again")
    // }
    // if(!isExistAyah){
    //   throw new ForbiddenException("Ayah not found please check your ayah id seed your quran in your data and try again")
    // }
    return this.prisma.gameData.create({
      data: {
        surahId: createGameDto.surahId ?? null,
        ayahId: createGameDto.ayahId ?? null,
        arabicText: createGameDto.arabicText,
        indonesianText: createGameDto.indonesianText,
        audioUrl: createGameDto.audioUrl ?? null,
        correctIndonesian: createGameDto.correct,
        optionsIndonesian: createGameDto.optionsIndonesian,
        correctArabic: createGameDto.correctArabic,
        optionsArabic: createGameDto.optionsArabic,
        correctEnglish: createGameDto.correctEnglish,
        optionsEnglish: createGameDto.optionsEnglish,
        dataType:createGameDto.dataType,
        duaName:createGameDto.duaName
      },
    });
  }
  
  async findAll() {
    return this.prisma.gameData.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const gameWithId=await this.prisma.gameData.findFirst({
      where:{
        id:id
      }
    })
    
    if (!gameWithId) {
      throw new NotFoundException(`Game question with id ${id} not found`);
    }
    const game = await this.prisma.gameData.findUnique({
      where: { id },
    });
    if (!game) {
      throw new NotFoundException(`Game question with id ${id} not found`);
    }
    return game;
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    const game = await this.prisma.gameData.findUnique({ where: { id } });
    if (!game) {
      throw new NotFoundException(`Game question with id ${id} not found`);
    }
    return this.prisma.gameData.update({
      where: { id },
      data: {
        surahId: updateGameDto.surahId ?? null,
        ayahId: updateGameDto.ayahId ?? null,
        arabicText: updateGameDto.arabicText,
        indonesianText: updateGameDto.indonesianText,
        audioUrl: updateGameDto.audioUrl ?? null,
        correctIndonesian: updateGameDto.correct,
        optionsIndonesian: updateGameDto.optionsIndonesian,
        correctArabic: updateGameDto.correctArabic,
        optionsArabic: updateGameDto.optionsArabic,
        correctEnglish: updateGameDto.correctEnglish,
        optionsEnglish: updateGameDto.optionsEnglish,
        dataType:updateGameDto.dataType,
        duaName:updateGameDto.duaName
      },
    });
  }

  async remove(id: string) {
    const game = await this.prisma.gameData.findUnique({ where: { id } });
    if (!game) {
      throw new NotFoundException(`Game question with id ${id} not found`);
    }
    await this.prisma.gameData.delete({
      where: { id },
    });
    return{
      message:`Game question with id ${id} has been deleted successfully`
    }
  }
  
async submitAnswer(userId: string, gameId: string, answer: string) {
  // 1️⃣ Fetch the question with related Surah & Juz
  const game = await this.prisma.gameData.findUnique({
    where: { id: gameId },
    include: {
      surah: { include: { juz: true } },
    },
  });

  if (!game) {
    throw new NotFoundException(`Game question with ID ${gameId} not found`);
  }

  // 2️⃣ Determine type (surah / dua)
  const type = game.dataType ?? "surah";

  // 3️⃣ Normalize answer
  const normalize = (s?: string) => (s ?? "").trim().toLowerCase();

  const isCorrect =
    normalize(answer) === normalize(game.correctIndonesian) ||
    normalize(answer) === normalize(game.correctArabic) ||
    normalize(answer) === normalize(game.correctEnglish);

  // 4️⃣ Find existing answer
  const existingAnswer = await this.prisma.userAnswer.findFirst({
    where: { userId, gameId },
  });

  let scoreIncrement = 0;

  // 5️⃣ Score increment logic
  if (!existingAnswer && isCorrect) scoreIncrement = 1;
  else if (existingAnswer && !existingAnswer.isCorrect && isCorrect)
    scoreIncrement = 1;

  // 6️⃣ Create / update answer
  if (existingAnswer) {
    await this.prisma.userAnswer.update({
      where: { id: existingAnswer.id },
      data: { isCorrect, answeredAt: new Date() },
    });
  } else {
    await this.prisma.userAnswer.create({
      data: { userId, gameId, isCorrect, answeredAt: new Date() },
    });
  }

  // 7️⃣ Prepare progress lookup
  const progressWhere: any = { userId, dataType: type };
  if (type === "surah") progressWhere.surahId = game.surahId!;
  else progressWhere.duaName = game.duaName!;

  // 8️⃣ Fetch or create progress
  let progress = await this.prisma.userGameProgress.findFirst({
    where: progressWhere,
  });

  if (progress?.completed) {
    throw new ForbiddenException(
      type === "surah"
        ? "You have already completed this Surah."
        : "You have already completed this Dua."
    );
  }

  if (!progress) {
    progress = await this.prisma.userGameProgress.create({
      data: {
        userId,
        dataType: type,
        surahId: type === "surah" ? game.surahId! : null,
        duaName: type === "dua" ? game.duaName! : null,
        score: scoreIncrement,
        completed: false,
      },
    });
  } else if (scoreIncrement > 0) {
    progress = await this.prisma.userGameProgress.update({
      where: { id: progress.id },
      data: { score: { increment: scoreIncrement } },
    });
  }

  // 9️⃣ Count total questions
  const totalQuestions = await this.prisma.gameData.count({
    where:
      type === "surah"
        ? { surahId: game.surahId }
        : { dataType: "dua", duaName: game.duaName },
  });

  // 🔟 Fetch updated progress
  const updatedProgress = await this.prisma.userGameProgress.findUnique({
    where: { id: progress.id },
  });

  let completed = false;

  // 1️⃣1️⃣ Check completion
  if (
    updatedProgress &&
    updatedProgress.score! >= totalQuestions &&
    !updatedProgress.completed
  ) {
    completed = true;

    await this.prisma.userGameProgress.update({
      where: { id: updatedProgress.id },
      data: { completed: true },
    });

    // Reward XP
    const xpReward = type === "surah" ? 20 : 10;
    await this.prisma.credential.update({
      where: { id: userId },
      data: { totalXP: { increment: xpReward } },
    });

    // Daily quest for Surah
    if (type === "surah") {
      await this.completeDailyQuest(userId, game.surahId!, game.ayahId!);
    }
  } else if (updatedProgress?.completed) {
    completed = true;
  }

  // 1️⃣2️⃣ Weekly quests
  await this.checkAndCompleteWeeklyQuests(
    userId,
    isCorrect,
    completed,
    type === "surah" ? game.surahId : null,
    game.surah?.juzId ?? null
  );

  // 1️⃣3️⃣ Update total overall progress
  const completedItems = await this.prisma.userGameProgress.count({
    where: { userId, completed: true },
  });

  const totalItems = 114 + 18;
  const progressPercent = (completedItems / totalItems) * 100;

  await this.prisma.credential.update({
    where: { id: userId },
    data: { progress: progressPercent },
  });


  // 1️⃣4️⃣ total correct and total wrong
  const answerFilter =
    type === "surah"
      ? { userId, game: { surahId: game.surahId } }
      : { userId, game: { dataType: "dua", duaName: game.duaName } };

  const totalCorrect = await this.prisma.userAnswer.count({
    where: { ...answerFilter, isCorrect: true },
  });

  const totalWrong = await this.prisma.userAnswer.count({
    where: { ...answerFilter, isCorrect: false },
  });

  // * Final Score %
  const finalScore =
    totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  //* Final response
  return {
    isCorrect,
    answeredCount: updatedProgress?.score ?? 0,
    totalQuestions,
    completed,
    overallProgress: progressPercent.toFixed(2),
    summary: {
      totalCorrect,
      totalWrong,
      finalScore: finalScore.toFixed(2) + "%",
    },
  };
}





  
  async completeDailyQuest(userId: string, surahId: any, ayahId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userQuest = await this.prisma.userQuest.findFirst({
      where: {
        userId,
        status: QuestStatus.IN_PROGRESS,
        quest: {
          type: QuestType.DAILY,
          surahId: surahId,
          ayahId: ayahId,
        },
        assignedAt: { gte: today },
      },
      include: { quest: true },
    });

    if (userQuest) {
      return this.completeQuest(userQuest.id);
    }
  }

  async checkAndCompleteWeeklyQuests(
    userId: string,
    isCorrect: boolean,
    surahCompleted: boolean,
    surahId?:any,
    juzId?: any,
  ) {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    const userQuest = await this.prisma.userQuest.findFirst({
      where: {
        userId,
        status: QuestStatus.IN_PROGRESS,
        quest: { type: QuestType.WEEKLY },
        assignedAt: { gte: startOfWeek },
      },
      include: { quest: true },
    });

    if (!userQuest) return;

    // 1. Logic for 'Answer X Correct Questions' quest
    if (userQuest.quest.targetCount && isCorrect && !userQuest.quest.targetSurah && !userQuest.quest.targetJuz) {
      const answersThisWeek = await this.prisma.userAnswer.count({
        where: { userId, isCorrect: true, answeredAt: { gte: startOfWeek } },
      });
      if (answersThisWeek >= userQuest.quest.targetCount) {
        await this.completeQuest(userQuest.id);
      }
    }

    // 2. Logic for 'Complete X Surahs' quest
    if (userQuest.quest.targetCount && surahCompleted && !userQuest.quest.targetSurah) {
      const surahsCompletedThisWeek = await this.prisma.userGameProgress.count({
        where: { userId, completed: true, playedAt: { gte: startOfWeek } },
      });
      if (surahsCompletedThisWeek >= userQuest.quest.targetCount) {
        await this.completeQuest(userQuest.id);
      }
    }

    // 3. Logic for 'Master Surah X' quest
    if (userQuest.quest.targetSurah && surahCompleted && surahId === userQuest.quest.targetSurah) {
      await this.completeQuest(userQuest.id);
    }
    
    // 4. Logic for 'Answer X questions from Juz Y' quest - **FIXED**
    if (userQuest.quest.targetJuz && isCorrect && juzId === userQuest.quest.targetJuz) {
        const correctAnswersThisWeekFromJuz = await this.prisma.userAnswer.count({
            where: {
                userId,
                isCorrect: true,
                answeredAt: { gte: startOfWeek },
                game: {
                    surah: {
                        juz: {
                            id: userQuest.quest.targetJuz,
                        },
                    },
                },
            },
        });
        if (userQuest.quest.targetCount && correctAnswersThisWeekFromJuz >= userQuest.quest.targetCount) {
            await this.completeQuest(userQuest.id);
        }
    }
  }

  async completeQuest(userQuestId: string) {
    const userQuest = await this.prisma.userQuest.findUnique({
      where: { id: userQuestId },
      include: { quest: true, user: { select: { id: true, totalXP: true } } },
    });

    if (userQuest && userQuest.status === QuestStatus.IN_PROGRESS) {
      await this.prisma.userQuest.update({
        where: { id: userQuest.id },
        data: { status: QuestStatus.COMPLETED, completedAt: new Date() },
      });

      await this.prisma.credential.update({
        where: { id: userQuest.userId },
        data: { totalXP: { increment: userQuest.quest.xpReward } },
      });

      console.log(`User ${userQuest.userId} completed quest "${userQuest.quest.title}" and received ${userQuest.quest.xpReward} XP.`);
      return userQuest;
    }
    return null;
  }


async createBulk() {
  try {
    //  Step 1: Locate and read the JSON file

    const isExistGametable=await this.prisma.gameData.findFirst()
    if(isExistGametable){
      throw new ForbiddenException('Game table already exist you cant create again');
    }
    const filePath = path.join(process.cwd(), 'quests_merged.json');

    if (!fs.existsSync(filePath)) {
      throw new ForbiddenException('quests_merged.json file not found in project root');
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    const dataArray = JSON.parse(rawData);

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new ForbiddenException('quests_merged.json is empty or not a valid array');
    }

    //  Step 2: Filter out undefined IDs for safe querying
    const uniqueSurahIds = [
      ...new Set(
        dataArray.map((d) => d.surahId).filter((id): id is number => id !== undefined)
      ),
    ];
    const uniqueAyahIds = [
      ...new Set(
        dataArray.map((d) => d.ayahId).filter((id): id is number => id !== undefined)
      ),
    ];

    //  Step 3: Find existing Surahs and Ayahs (optional, can skip if you don't need validation)
    const existingSurahs = await this.prisma.surah.findMany({
      where: { id: { in: uniqueSurahIds } },
      select: { id: true },
    });

    const existingAyahs = await this.prisma.ayah.findMany({
      where: { id: { in: uniqueAyahIds } },
      select: { id: true },
    });

    const foundSurahIds = existingSurahs.map((s) => s.id);
    const foundAyahIds = existingAyahs.map((a) => a.id);

    const missingSurahs = uniqueSurahIds.filter((id) => !foundSurahIds.includes(id));
    const missingAyahs = uniqueAyahIds.filter((id) => !foundAyahIds.includes(id));

    if (missingSurahs.length > 0) console.warn('⚠ Missing Surahs:', missingSurahs);
    if (missingAyahs.length > 0) console.warn('⚠ Missing Ayahs:', missingAyahs);

    //  Step 4: Prepare and insert data into gameData
    const result = await this.prisma.gameData.createMany({
      data: dataArray.map((d) => ({
        surahId: d.surahId ?? null, // optional
        ayahId: d.ayahId ?? null,   // optional
        arabicText: d.arabicText,
        indonesianText: d.indonesianText,
        audioUrl: d.audioUrl ?? null,
        correctArabic: d.correctArabic,
        optionsArabic: d.optionsArabic,
        correctEnglish: d.correctEnglish,
        optionsEnglish: d.optionsEnglish,
        correctIndonesian: d.correctIndonesian,
        optionsIndonesian: d.optionsIndonesian,
        dataType: d.dataType ?? null,
        duaName: d.duaName ?? null,
      })),
      skipDuplicates: true,
    });

    //  Step 5: Return summary
    return {
      message: `✅ Successfully inserted ${result.count} records from quests_merged.json.`,
    };
  } catch (err) {
    console.error('❌ Error during bulk insert:', err);
    throw new InternalServerErrorException(err.message);
  }
}

async deleteBulkGame(){
  await this.prisma.gameData.deleteMany();
  return{
    message:"Deleted all game data"
  }
}
  

async getAllDua(){
  const dua=await this.prisma.gameData.findMany({
    where:{
      dataType:"dua"
    }
  })
  return dua
}


async postDua(dto:DuaDto){
  const {duaDisplayName,duaReletionName}=dto
  const isExist=await this.prisma.dua.findFirst({
    where:{
      duaDisplayName
    }
  })
  if(isExist){
    throw new ForbiddenException("Dua already exist please try another one")
  }
  const res=await this.prisma.dua.create({
    data:{
      duaDisplayName,
      duaName:duaReletionName
    }
  })
  return res
}

async getGameByDua(duaName:string){
  const res=await this.prisma.gameData.findMany({
    where:{
      duaName:duaName
    }
  })
  return res
}


async createAllDua(){
  const isExist=await this.prisma.dua.findFirst()
  if(isExist){
    throw new ForbiddenException("Dua already exist please try another one")
  }
  await this.prisma.dua.createMany({
  data: [
    { duaName: "niyah", duaDisplayName: "Niyyah Subuh" },
    { duaName: "iftia", duaDisplayName: "Doa Iftitah Part I" },
    { duaName: "iftia-2", duaDisplayName: "Doa Iftitah Part II" },
    { duaName: "iftia-3", duaDisplayName: "Doa Iftitah Part III" },
    { duaName: "ruku", duaDisplayName: "Ruku" },
    { duaName: "itidal", duaDisplayName: "I‘tidal" },
    { duaName: "sujud", duaDisplayName: "Sujud" },
    { duaName: "duduk_antar_sujud", duaDisplayName: "Duduk Antara Sujud" },
    { duaName: "tasyahhud_part_1", duaDisplayName: "Tasyahhud Akhir I" },
    { duaName: "tasyahhud_part_2", duaDisplayName: "Tasyahhud Akhir II" },
    { duaName: "tasyahhud_part_3", duaDisplayName: "Tasyahhud Akhir III" },
    { duaName: "qunut_part_1", duaDisplayName: "Doa Qunut I" },
    { duaName: "qunut_part_2", duaDisplayName: "Doa Qunut II" },
    { duaName: "qunut_part_3", duaDisplayName: "Doa Qunut III" },
    { duaName: "istighfar_part_1", duaDisplayName: "Sayyidul Istighfar I" },
    { duaName: "istighfar_part_2", duaDisplayName: "Sayyidul Istighfar II" },
    { duaName: "istighfar_part_3", duaDisplayName: "Sayyidul Istighfar III" },
    { duaName: "dua_selamat", duaDisplayName: "Doa Selamat" }
  ],
  skipDuplicates: true,
});
}


async deleteDuaTable(){
  await this.prisma.dua.deleteMany();
  return{
    message:"Deleted all dua data"
  }
}

// //* COMPOETE MISSIONS OF USER
async completeUserMission(userId: string, missionId: string) {
  //  Fetch the user mission
  const userMission = await this.prisma.userQuest.findFirst({
    where: {
      id: missionId,
      userId,
    },
    include: { quest: true },
  });

  if (!userMission) {
    throw new ForbiddenException("Mission not found");
  }

  //  Check if already completed
  if (userMission.status === QuestStatus.COMPLETED) {
    const message =
      userMission.quest.type === QuestType.WEEKLY
        ? "You have already completed this weekly mission. Come back next week!"
        : "You have already completed this daily mission. Come back again tomorrow!";
    return {
      success: false,
      message,
    };
  }

  //  Mark as completed
  await this.prisma.userQuest.update({
    where: { id: missionId },
    data: {
      status: QuestStatus.COMPLETED,
      completedAt: new Date(),
    },
  });

  // Reward XP
  if (userMission.quest?.xpReward) {
    await this.prisma.credential.update({
      where: { id: userId },
      data: {
        totalXP: { increment: userMission.quest.xpReward },
      },
    });
  }

  // Prepare success message
  const successMessage =
    userMission.quest.type === QuestType.WEEKLY
      ? `Weekly mission "${userMission.quest.title}" completed! You earned ${userMission.quest.xpReward} XP. Come back next week for a new one.`
      : `Daily mission "${userMission.quest.title}" completed! You earned ${userMission.quest.xpReward} XP. Come back tomorrow for a new one.`;

  return {
    success: true,
    message: successMessage,
    data: {
      missionId: userMission.id,
      title: userMission.quest.title,
      xpReward: userMission.quest.xpReward,
      type: userMission.quest.type,
    },
  };
}


async getDailyQuests(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return this.prisma.userQuest.findMany({
    where: {
      userId,
      quest: { type: QuestType.DAILY },
      assignedAt: { gte: today },
    },
    include: { quest: true },
  });
}

async getWeeklyQuests(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return this.prisma.userQuest.findMany({
    where: {
      userId,
      quest: { type: QuestType.WEEKLY },
      assignedAt: { gte: startOfWeek },
    },
    include: { quest: true },
  });
}

}